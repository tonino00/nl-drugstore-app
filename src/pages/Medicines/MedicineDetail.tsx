import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { favoriteService } from '../../services/favoriteService';
import StockBadge from '../../components/Medicine/StockBadge';
import ExpiryAlert from '../../components/Medicine/ExpiryAlert';
import { useAuth } from '../../hooks/useAuth';

import { Actions, Btn, Card } from '../../styles/pages/Medicines/MedicineDetail/styles';

export default function MedicineDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isPharmacist = user?.role === 'pharmacist' || user?.role === 'admin';
  const isPatient = user?.role === 'user';

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await medicineService.getById(id!);
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
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!medicine) return <div>Medicamento não encontrado.</div>;

  const inStock = medicine.quantidade > 0;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to="/medicines" style={{ color: '#616161', textDecoration: 'none', fontSize: 14 }}>← Voltar</Link>
        <h2 style={{ margin: 0 }}>{medicine.nome}</h2>
      </div>

      {/* Status badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <StockBadge quantity={medicine.quantidade} />
        <ExpiryAlert expiryDate={medicine.validade} />
      </div>

      {/* Card principal */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20, background: '#fff' }}>
        <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 16, color: '#333' }}>Informações gerais</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 24px' }}>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Princípio ativo</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{medicine.principio_ativo || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Concentração</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{medicine.concentracao || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Forma farmacêutica</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{medicine.forma_farmaceutica || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Categoria</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{medicine.categoria || '-'}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Validade</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>
              {medicine.validade ? new Date(medicine.validade).toLocaleDateString('pt-BR') : '-'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Estoque</div>
            <div style={{ fontSize: 15, color: '#333', fontWeight: 500 }}>{medicine.quantidade} unidades</div>
          </div>
        </div>
      </div>

      {/* Descrição */}
      {medicine.descricao ? (
        <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20, background: '#fff' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16, color: '#333' }}>Descrição</h3>
          <p style={{ margin: 0, fontSize: 15, color: '#616161', lineHeight: 1.6 }}>{medicine.descricao}</p>
        </div>
      ) : null}

      {/* Contraindicações */}
      {medicine.contraindicacoes ? (
        <div style={{ borderRadius: 12, border: '1px solid #fecaca', padding: 24, marginBottom: 20, background: '#fef2f2' }}>
          <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16, color: '#991b1b' }}>⚠️ Contraindicações</h3>
          <p style={{ margin: 0, fontSize: 15, color: '#7f1d1d', lineHeight: 1.6 }}>{medicine.contraindicacoes}</p>
        </div>
      ) : null}

      {/* Ações */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {isPatient ? (
          <>
            <Btn
              type="button"
              onClick={async () => {
                try {
                  await favoriteService.add(medicine.id);
                  toast.success('Adicionado aos favoritos');
                } catch {
                  toast.error('Falha ao favoritar');
                }
              }}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}
            >
              ❤️ Favoritar
            </Btn>

            {!inStock ? (
              <Btn
                type="button"
                onClick={async () => {
                  try {
                    await favoriteService.enableRestockNotify(medicine.id);
                    toast.success('Notificação de restoque ativada');
                  } catch {
                    toast.error('Falha ao ativar notificação de restoque');
                  }
                }}
                style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}
              >
                🔔 Notificar restoque
              </Btn>
            ) : null}
          </>
        ) : null}

        {isPharmacist ? (
          <>
            <Link to={`/medicines/${medicine.id}/edit`} style={{ textDecoration: 'none' }}>
              <Btn type="button" style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                ✏️ Editar
              </Btn>
            </Link>
            <Link to={`/stock/manage/${medicine.id}`} style={{ textDecoration: 'none' }}>
              <Btn type="button" style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
                📦 Gerenciar estoque
              </Btn>
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
