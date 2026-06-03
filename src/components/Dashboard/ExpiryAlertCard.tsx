import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { batchService } from '../../services/batchService';
import type { Batch } from '../../types/batch.types';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid #e5e7eb;
  padding: ${({ theme }) => theme.spacing.md};
  background: #ffffff;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const Small = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Item = styled.div<{ $danger: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ $danger }) => ($danger ? '#fecaca' : '#fcd34d')};
  background: ${({ $danger }) => ($danger ? '#fef2f2' : '#fffbeb')};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Name = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const Meta = styled.div`
  font-size: 0.75rem;
  color: #4b5563;
`;

const DaysBadge = styled.span<{ $danger: boolean }>`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ $danger }) => ($danger ? '#b91c1c' : '#92400e')};
  background: ${({ $danger }) => ($danger ? '#fee2e2' : '#fef3c7')};
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 0.75rem;
  cursor: pointer;
`;

export default function ExpiryAlertCard() {
  const [items, setItems] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await batchService.expiring(30);
        if (!res.success) return;
        if (mounted) setItems(res.data.rows || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <Header>
          <Title>Lotes com validade próxima</Title>
        </Header>
        <Small>Carregando...</Small>
      </Card>
    );
  }

  if (!items.length) return null;

  const computeDays = (b: Batch) => {
    if (typeof b.daysUntilExpiry === 'number') return b.daysUntilExpiry;
    if (!b.expiryDate) return null;
    const exp = new Date(b.expiryDate);
    const now = new Date();
    return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card>
      <Header>
        <div>
          <Title>Lotes com validade próxima</Title>
          <Small>Lotes com validade em até 30 dias</Small>
        </div>
      </Header>

      <List>
        {items.map((b) => {
          const days = computeDays(b);
          const danger = typeof days === 'number' && days <= 7;
          return (
            <Item key={b.id} $danger={danger}>
              <div>
                <Name>{(b as any).medicineName || `Medicamento #${b.medicineId}`}</Name>
                <Meta>
                  Lote <strong>{b.batchNumber}</strong> · Qtd: {b.quantity}{' '}
                  {typeof days === 'number' ? `· ${days} dia${days === 1 ? '' : 's'} restantes` : ''}
                </Meta>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {typeof days === 'number' ? (
                  <DaysBadge $danger={danger}>
                    {days <= 0 ? 'Vencido' : `${days} dia${days === 1 ? '' : 's'}`}
                  </DaysBadge>
                ) : null}
                <Button type="button" onClick={() => navigate(`/stock/manage/${b.medicineId}`)}>
                  Ver estoque
                </Button>
              </div>
            </Item>
          );
        })}
      </List>
    </Card>
  );
}
