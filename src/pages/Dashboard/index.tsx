import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import { medicineService } from '../../services/medicineService';
import type { Medicine } from '../../types/medicine.types';
import ExpiryAlertCard from '../../components/Dashboard/ExpiryAlertCard';

export default function DashboardPage() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    expiring30: 0,
    expiring7: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<Medicine[]>([]);
  const [expiringItems, setExpiringItems] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [all, low, exp30, exp7] = await Promise.all([
          medicineService.list({ page: 1, limit: 1 }),
          medicineService.lowStock(),
          medicineService.expiring(30),
          medicineService.expiring(7),
        ]);
        if (mounted) {
          setStats({
            total: all.total || 0,
            lowStock: low.length,
            expiring30: exp30.length,
            expiring7: exp7.length,
          });
          setLowStockItems(low.slice(0, 5));
          setExpiringItems(exp7.slice(0, 5));
        }
      } catch {
        if (mounted) toast.error('Falha ao carregar dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (user?.role !== 'pharmacist' && user?.role !== 'admin') {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {loading ? <p>Carregando...</p> : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Total de medicamentos</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div>
          <Link to="/medicines">Ver todos</Link>
        </div>
        <div style={{ border: '1px solid #fca5a5', borderRadius: 8, padding: 16, background: '#fef2f2' }}>
          <div style={{ fontSize: 12, color: '#dc2626' }}>Estoque baixo</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#dc2626' }}>{stats.lowStock}</div>
          <Link to="/stock/inventory">Gerenciar estoque</Link>
        </div>
        <div style={{ border: '1px solid #fcd34d', borderRadius: 8, padding: 16, background: '#fffbeb' }}>
          <div style={{ fontSize: 12, color: '#d97706' }}>Vencendo em 30 dias</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#d97706' }}>{stats.expiring30}</div>
        </div>
        <div style={{ border: '1px solid #f87171', borderRadius: 8, padding: 16, background: '#fef2f2' }}>
          <div style={{ fontSize: 12, color: '#dc2626' }}>Vencendo em 7 dias</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#dc2626' }}>{stats.expiring7}</div>
        </div>
      </div>

      {lowStockItems.length > 0 ? (
        <div style={{ marginBottom: 24 }}>
          <h3>Estoque baixo</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {lowStockItems.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{m.nome}</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>Qtd: {m.quantidade}</span>
                <Link to={`/stock/manage/${m.id}`}>Repor</Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {expiringItems.length > 0 ? (
        <div>
          <h3>Vencendo em breve (7 dias)</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {expiringItems.map((m) => (
              <div
                key={m.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{m.nome}</span>
                <span style={{ color: '#d97706' }}>
                  Validade: {m.validade ? new Date(m.validade).toLocaleDateString() : '-'}
                </span>
                <Link to={`/medicines/${m.id}`}>Ver</Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ExpiryAlertCard />
    </div>
  );
}
