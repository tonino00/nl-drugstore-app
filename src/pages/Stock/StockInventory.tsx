import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';

export default function StockInventoryPage() {
  const { user } = useAuth();
  const isPharmacist = user?.role === 'pharmacist' || user?.role === 'admin';

  const [items, setItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [realQuantities, setRealQuantities] = useState<Record<string | number, number>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await medicineService.list({ page: 1, limit: 50 });
        console.log('StockInventory data:', data);
        if (mounted) setItems(data.items || []);
      } catch (e: any) {
        console.error('StockInventory error:', e?.response?.data || e);
        toast.error('Falha ao carregar estoque');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isPharmacist) {
    return (
      <div>
        <h2>Estoque</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  const exportPDF = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Relatório de Estoque</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
  h1 { font-size: 24px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
  th { background: #f5f5f5; font-weight: 600; }
  .badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
</style>
</head>
<body>
  <h1>Relatório de Estoque</h1>
  <p>Gerado em: ${new Date().toLocaleString()}</p>
  <table>
    <thead>
      <tr>
        <th>Medicamento</th><th>Qtd</th><th>Mín</th><th>Validade</th><th>Local</th><th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((m) => {
        const qtd = m.quantidade ?? 0;
        const min = m.quantidade_minima ?? 0;
        const expiry = m.validade ? new Date(m.validade) : null;
        const now = new Date();
        let status = 'OK';
        let statusColor = '#16a34a';
        let statusBg = '#f0fdf4';
        if (expiry && expiry < now) { status = 'VENCIDO'; statusColor = '#9e9e9e'; statusBg = '#f5f5f5'; }
        else if (qtd === 0) { status = 'FALTA'; statusColor = '#b71c1c'; statusBg = '#ffebee'; }
        else if (qtd <= min) { status = 'CRÍTICO'; statusColor = '#dc2626'; statusBg = '#fef2f2'; }
        else if (expiry) {
          const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (days <= 30) { status = 'VENCE'; statusColor = '#d97706'; statusBg = '#fffbeb'; }
        }
        return `<tr>
          <td>${m.nome} ${m.principio_ativo || ''} ${m.concentracao || ''}</td>
          <td>${qtd}</td>
          <td>${min}</td>
          <td>${m.validade ? new Date(m.validade).toLocaleDateString() : '-'}</td>
          <td>${m.localizacao_prateleira || '-'}</td>
          <td><span class="badge" style="color:${statusColor};background:${statusBg}">${status}</span></td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
</body>
</html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 500);
    }
  };

  const handleSaveCorrections = async () => {
    const corrections = Object.entries(realQuantities).filter(([, v]) => !isNaN(v));
    if (corrections.length === 0) {
      toast.error('Nenhuma correção para salvar');
      return;
    }
    try {
      setSaving(true);
      await Promise.all(
        corrections.map(async ([id, realQty]) => {
          const item = items.find((m) => String(m.id) === id);
          if (!item) return;
          const delta = Number(realQty) - (item.quantidade || 0);
          if (delta === 0) return;
          await medicineService.patchStock(id, {
            delta,
            motivo: 'correção inventário',
            observacao: `Ajuste de estoque: ${item.quantidade || 0} → ${realQty}`,
          });
        })
      );
      toast.success('Correções salvas');
      setRealQuantities({});
      // refresh list
      const data = await medicineService.list({ page: 1, limit: 50 });
      setItems(data.items || []);
    } catch {
      toast.error('Falha ao salvar correções');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2>Estoque</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={exportPDF} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
            Exportar PDF
          </button>
          <button type="button" onClick={handleSaveCorrections} disabled={saving || Object.keys(realQuantities).length === 0}>
            {saving ? 'Salvando...' : 'Salvar correções'}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : items.length === 0 ? (
        <p>Nenhum medicamento encontrado.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map((m) => (
            <div
              key={m.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.nome}</strong>
                <small style={{ color: '#6b7280' }}>ID: {m.id} | Estoque atual: {m.quantidade ?? 0}</small>
                {(m.quantidade ?? 0) < 5 ? (
                  <span style={{ display: 'inline-block', marginLeft: 8, padding: '2px 8px', borderRadius: 4, background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 600 }}>
                    CRÍTICO
                  </span>
                ) : (m.quantidade ?? 0) <= 10 ? (
                  <span style={{ display: 'inline-block', marginLeft: 8, padding: '2px 8px', borderRadius: 4, background: '#fffbeb', color: '#d97706', fontSize: 11, fontWeight: 600 }}>
                    BAIXO
                  </span>
                ) : null}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <label style={{ fontSize: 12, color: '#6b7280' }}>Estoque real:</label>
                <input
                  type="number"
                  min={0}
                  style={{ width: 80 }}
                  value={realQuantities[m.id] ?? ''}
                  onChange={(e) =>
                    setRealQuantities((prev) => ({
                      ...prev,
                      [m.id]: Number(e.target.value),
                    }))
                  }
                />
                <Link to={`/stock/manage/${m.id}`}>Gerenciar</Link>
                <Link to={`/stock/movements/${m.id}`}>Movimentações</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
