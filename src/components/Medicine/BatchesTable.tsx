import { useEffect, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

import { batchService, type BatchStatusFilter } from '../../services/batchService';
import type { Batch, BatchSummary } from '../../types/batch.types';
import { formatDate } from '../../utils/formatters';
import BatchForm from './BatchForm';

const Wrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: ${({ $variant, theme }) =>
    $variant === 'ghost' ? `1px solid ${theme.colors.grayLight}` : 'none'};
  background: ${({ $variant, theme }) =>
    $variant === 'ghost' ? theme.colors.white : theme.colors.primary};
  color: ${({ $variant, theme }) =>
    $variant === 'ghost' ? theme.colors.grayDark : theme.colors.white};
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SummaryCard = styled.div<{ $accent?: 'primary' | 'warning' | 'danger' }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ $accent, theme }) =>
      $accent === 'warning'
        ? '#facc15'
        : $accent === 'danger'
        ? '#fca5a5'
        : theme.colors.grayLight};
  background:
    ${({ $accent }) =>
      $accent === 'warning'
        ? '#fffbeb'
        : $accent === 'danger'
        ? '#fef2f2'
        : '#ffffff'};
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const SummaryValue = styled.div<{ $accent?: 'primary' | 'warning' | 'danger' }>`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: 1.25rem;
  font-weight: 700;
  color:
    ${({ $accent }) =>
      $accent === 'warning'
        ? '#d97706'
        : $accent === 'danger'
        ? '#dc2626'
        : '#111827'};
`;

const Card = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
`;

const StatusFilter = styled.div`
  display: inline-flex;
  padding: 2px;
  border-radius: 999px;
  background: #f3f4f6;
`;

const StatusOption = styled.button<{ $active: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#111827' : '#6b7280')};
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 10px;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 8px 10px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

const StatusBadge = styled.span<{ $variant: 'active' | 'expiring' | 'expired' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  ${({ $variant }) => {
    if ($variant === 'active') {
      return 'background:#ecfdf5;color:#16a34a;';
    }
    if ($variant === 'expiring') {
      return 'background:#fffbeb;color:#d97706;';
    }
    return 'background:#f3f4f6;color:#6b7280;';
  }}
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 320;
`;

const ConfirmCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ConfirmTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const ConfirmText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
`;

const ConfirmHighlight = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: #fef2f2;
  border: 1px solid #fecaca;
  font-size: 0.8125rem;
  color: #991b1b;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface BatchesTableProps {
  medicineId: number;
  canManage?: boolean;
}

export default function BatchesTable({ medicineId, canManage = false }: BatchesTableProps) {
  const [rows, setRows] = useState<Batch[]>([]);
  const [summary, setSummary] = useState<BatchSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BatchStatusFilter>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmBatch, setConfirmBatch] = useState<Batch | null>(null);
  const [expiring, setExpiring] = useState(false);

  const load = async (nextStatus: BatchStatusFilter = status) => {
    try {
      setLoading(true);
      const res = await batchService.listForMedicine(medicineId, nextStatus);
      if (!res.success) {
        toast.error(res.message || 'Falha ao carregar lotes');
        return;
      }
      setRows(res.data.rows || []);
      setSummary(res.data.summary || null);
    } catch {
      toast.error('Falha ao carregar lotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load('active');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId]);

  const handleConfirmExpire = async () => {
    if (!confirmBatch) return;
    try {
      setExpiring(true);
      const res = await batchService.expire(confirmBatch.id);
      if (!res.success) {
        toast.error(res.message || 'Falha ao desativar lote');
        return;
      }
      toast.success(res.message || 'Lote desativado');
      setConfirmBatch(null);
      void load();
    } catch {
      toast.error('Falha ao desativar lote');
    } finally {
      setExpiring(false);
    }
  };

  const resolveStatus = (b: Batch): 'active' | 'expiring' | 'expired' => {
    const days = b.daysUntilExpiry ?? null;
    if (!b.isActive || days !== null && days < 0) return 'expired';
    if (days !== null && days <= 30) return 'expiring';
    return 'active';
  };

  return (
    <Wrapper>
      <HeaderRow>
        <Title>Controle de lotes</Title>
        <Actions>
          <StatusFilter>
            {(
              [
                { value: 'active', label: 'Ativos' },
                { value: 'expired', label: 'Vencidos' },
                { value: 'all', label: 'Todos' },
              ] as Array<{ value: BatchStatusFilter; label: string }>
            ).map((opt) => (
              <StatusOption
                key={opt.value}
                type="button"
                $active={status === opt.value}
                onClick={() => {
                  setStatus(opt.value);
                  void load(opt.value);
                }}
              >
                {opt.label}
              </StatusOption>
            ))}
          </StatusFilter>

          {canManage ? (
            <Button type="button" onClick={() => setModalOpen(true)}>
              + Novo lote
            </Button>
          ) : null}
        </Actions>
      </HeaderRow>

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>Total de unidades</SummaryLabel>
          <SummaryValue $accent="primary">{summary?.totalQuantity ?? 0}</SummaryValue>
        </SummaryCard>
        <SummaryCard $accent="warning">
          <SummaryLabel>Vencem em 30 dias</SummaryLabel>
          <SummaryValue $accent="warning">{summary?.expiringSoon ?? 0}</SummaryValue>
        </SummaryCard>
        <SummaryCard $accent="danger">
          <SummaryLabel>Lotes vencidos</SummaryLabel>
          <SummaryValue $accent="danger">{summary?.expiredBatches ?? 0}</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <Card>
        {loading ? (
          <div style={{ padding: 12, fontSize: 13, color: '#6b7280' }}>Carregando lotes...</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 16, fontSize: 13, color: '#9ca3af' }}>
            Nenhum lote encontrado para este medicamento.
          </div>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Nº Lote</Th>
                <Th>Quantidade</Th>
                <Th>Fabricação</Th>
                <Th>Validade</Th>
                <Th>Status</Th>
                {canManage ? <Th>Ações</Th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => {
                const st = resolveStatus(b);
                return (
                  <tr key={b.id}>
                    <Td>{b.batchNumber}</Td>
                    <Td>{b.quantity}</Td>
                    <Td>{b.manufacturingDate ? formatDate(b.manufacturingDate) : '-'}</Td>
                    <Td>{b.expiryDate ? formatDate(b.expiryDate) : '-'}</Td>
                    <Td>
                      <StatusBadge
                        $variant={st === 'active' ? 'active' : st === 'expiring' ? 'expiring' : 'expired'}
                      >
                        {st === 'active'
                          ? 'Ativo'
                          : st === 'expiring'
                          ? 'Vence em breve'
                          : 'Vencido'}
                      </StatusBadge>
                    </Td>
                    {canManage ? (
                      <Td>
                        {st !== 'expired' && b.isActive ? (
                          <Button
                            type="button"
                            $variant="ghost"
                            onClick={() => setConfirmBatch(b)}
                          >
                            Dar baixa (vencido)
                          </Button>
                        ) : null}
                      </Td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {modalOpen ? (
        <BatchForm
          medicineId={medicineId}
          onClose={() => setModalOpen(false)}
          onCreated={() => void load()}
        />
      ) : null}

      {confirmBatch ? (
        <ConfirmOverlay>
          <ConfirmCard>
            <ConfirmTitle>Dar baixa em lote vencido</ConfirmTitle>
            <ConfirmText>
              Confirme a desativação deste lote. Ele será marcado como vencido e não poderá mais ser utilizado em
              novas saídas.
            </ConfirmText>
            <ConfirmHighlight>
              <div><strong>Lote:</strong> {confirmBatch.batchNumber}</div>
              <div><strong>Quantidade:</strong> {confirmBatch.quantity} un</div>
              <div>
                <strong>Validade:</strong>{' '}
                {confirmBatch.expiryDate ? formatDate(confirmBatch.expiryDate) : '-'}
              </div>
            </ConfirmHighlight>
            <ConfirmActions>
              <Button
                type="button"
                $variant="ghost"
                onClick={() => setConfirmBatch(null)}
                disabled={expiring}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleConfirmExpire}
                disabled={expiring}
              >
                {expiring ? 'Finalizando...' : 'Confirmar baixa'}
              </Button>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmOverlay>
      ) : null}
    </Wrapper>
  );
}
