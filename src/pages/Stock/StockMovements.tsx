import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { medicineService, type StockMovement } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';

export default function StockMovementsPage() {
  const { medicineId } = useParams();
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [items, setItems] = useState<StockMovement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!medicineId) return;
        setLoading(true);
        const data = await medicineService.movements(medicineId, { page, limit });
        if (mounted) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch {
        toast.error('Falha ao carregar movimentações');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [medicineId, page, limit]);

  if (!isStaff) {
    return (
      <div>
        <h2>Histórico de movimentações</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/stock/manage/${medicineId}`}>Voltar</Link>
      <h2>Histórico de movimentações</h2>

      {loading ? <p>Carregando...</p> : null}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
          Anterior
        </button>
        <div>
          Página {page} de {totalPages}
        </div>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Próxima
        </button>
      </div>

      {items.length === 0 && !loading ? <p>Nenhuma movimentação encontrada.</p> : null}

      {items.length > 0 ? (
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Data</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Tipo</th>
                <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Qtd</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Motivo</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Usuário</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e5e7eb' }}>Obs.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{m.tipo}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6', textAlign: 'right' }}>{m.quantidade}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{m.motivo}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{m.user?.nome || '-'}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f3f4f6' }}>{m.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
