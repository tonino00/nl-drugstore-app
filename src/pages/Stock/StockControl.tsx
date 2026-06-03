import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';
import MovementForm from '../../components/Stock/MovementForm';

export default function StockControlPage() {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!medicineId) return;
        setLoading(true);
        const data = await medicineService.getById(medicineId);
        if (mounted) setMedicine(data);
      } catch {
        toast.error('Falha ao carregar medicamento');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [medicineId]);

  if (!isStaff) {
    return (
      <div>
        <h2>Controle de estoque</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to={`/medicines/${medicineId}`} style={{ color: '#616161', textDecoration: 'none', fontSize: 14 }}>← Voltar</Link>
        <h2 style={{ margin: 0 }}>Controle de estoque</h2>
      </div>

      {loading ? (
        <p style={{ color: '#9e9e9e' }}>Carregando...</p>
      ) : null}

      {/* Card do medicamento */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, marginBottom: 24, background: '#fff' }}>
        <div style={{ fontSize: 13, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Medicamento</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#333', marginBottom: 16 }}>{medicine?.nome || '-'}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: '#f9fafb' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1976d2' }}>{medicine?.quantidade ?? 0}</div>
            <div style={{ fontSize: 12, color: '#9e9e9e' }}>Estoque atual</div>
          </div>
          <div style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: '#f9fafb' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2e7d32' }}>{medicine?.quantidade_minima ?? 0}</div>
            <div style={{ fontSize: 12, color: '#9e9e9e' }}>Mínimo</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, background: '#fff' }}>
        <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18 }}>Nova movimentação</h3>
        {medicineId && (
          <MovementForm
            medicineId={Number(medicineId)}
            onUpdated={(updated) => setMedicine(updated)}
          />
        )}
        <div style={{ marginTop: 16 }}>
          <button
            type="button"
            onClick={() => navigate(`/stock/movements/${medicineId}`)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#fff',
              color: '#616161',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Ver histórico de movimentações
          </button>
        </div>
      </div>
    </div>
  );
}
