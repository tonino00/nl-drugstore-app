import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaDownload, FaSave } from 'react-icons/fa';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';
import DashboardCards from '../../components/Stock/DashboardCards';
import StockTable from '../../components/Stock/StockTable';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PrimaryButton,
  Flex,
  ResponsiveGrid,
  ChartContainer,
  ChartTitle,
  Spacer,
} from '../../styles/components/Stock/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      <PageContainer>
        <PageHeader>
          <div>
            <PageTitle>Estoque</PageTitle>
            <PageSubtitle>Acesso restrito.</PageSubtitle>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  // Dados para gráficos
  const chartData = useMemo(() => {
    const statusData = [
      { name: 'Normal', value: 0, color: '#2E7D32' },
      { name: 'Baixo', value: 0, color: '#F57C00' },
      { name: 'Crítico', value: 0, color: '#B71C1C' },
      { name: 'Vencendo', value: 0, color: '#E65100' },
      { name: 'Vencido', value: 0, color: '#616161' },
    ];

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    items.forEach(medicine => {
      const quantity = medicine.quantidade ?? 0;
      const minimum = medicine.quantidade_minima ?? 0;
      const expiry = medicine.validade ? new Date(medicine.validade) : null;

      if (expiry && expiry < now) {
        statusData[4].value++;
      } else if (quantity === 0) {
        statusData[2].value++;
      } else if (quantity <= minimum) {
        statusData[1].value++;
      } else if (expiry && expiry <= thirtyDaysFromNow) {
        statusData[3].value++;
      } else {
        statusData[0].value++;
      }
    });

    return statusData;
  }, [items]);

  const locationData = useMemo(() => {
    const locationMap = new Map<string, number>();
    
    items.forEach(medicine => {
      const location = medicine.localizacao_prateleira || 'Não definida';
      locationMap.set(location, (locationMap.get(location) || 0) + (medicine.quantidade || 0));
    });

    return Array.from(locationMap.entries())
      .map(([location, quantity]) => ({ location, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [items]);

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
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .metric { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; margin: 10px; }
  .metric-value { font-size: 24px; font-weight: bold; color: #2E7D32; }
  .metric-label { font-size: 12px; color: #666; }
</style>
</head>
<body>
  <h1>Relatório de Estoque</h1>
  <p>Gerado em: ${new Date().toLocaleString()}</p>
  
  <div class="header">
    <div class="metric">
      <div class="metric-value">${items.length}</div>
      <div class="metric-label">Total de Medicamentos</div>
    </div>
    <div class="metric">
      <div class="metric-value">${items.reduce((sum, m) => sum + (m.quantidade || 0), 0)}</div>
      <div class="metric-label">Total de Itens</div>
    </div>
    <div class="metric">
      <div class="metric-value">${items.filter(m => (m.quantidade || 0) <= (m.quantidade_minima || 0)).length}</div>
      <div class="metric-label">Estoque Crítico</div>
    </div>
  </div>
  
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

  const handleManage = (medicine: Medicine) => {
    window.location.href = `/stock/manage/${medicine.id}`;
  };

  const handleHistory = (medicine: Medicine) => {
    window.location.href = `/stock/movements/${medicine.id}`;
  };

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Gerenciamento de Estoque</PageTitle>
          <PageSubtitle>
            Controle completo de medicamentos e movimentações
          </PageSubtitle>
        </div>
        <Flex $gap="12px" $wrap>
          <PrimaryButton onClick={handleSaveCorrections} disabled={saving || Object.keys(realQuantities).length === 0}>
            <FaSave />
            {saving ? 'Salvando...' : 'Salvar Correções'}
          </PrimaryButton>
        </Flex>
      </PageHeader>

      {/* Dashboard Cards */}
      <DashboardCards medicines={items} />
      <Spacer $size="lg" />

      {/* Gráficos */}
      <ResponsiveGrid $columns={2}>
        <ChartContainer>
          <ChartTitle>Status do Estoque</ChartTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>Itens por Localização</ChartTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#2E7D32" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ResponsiveGrid>
      <Spacer $size="lg" />

      {/* Tabela de Estoque */}
      <StockTable
        medicines={items}
        loading={loading}
        onManage={handleManage}
        onHistory={handleHistory}
        onExport={exportPDF}
      />
    </PageContainer>
  );
}
