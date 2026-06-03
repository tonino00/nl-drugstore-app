import { useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

import { batchService } from '../../services/batchService';
import type { BatchTraceResult } from '../../types/batch.types';

const Page = styled.div`
  max-width: 480px;
  margin: 0 auto;
`;

const Card = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
`;

const FormRow = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div<{ $valid: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ $valid }) => ($valid ? '#bbf7d0' : '#fecaca')};
  background: ${({ $valid }) => ($valid ? '#ecfdf5' : '#fef2f2')};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ResultTitle = styled.div<{ $valid: boolean }>`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ $valid }) => ($valid ? '#166534' : '#b91c1c')};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ResultMeta = styled.div`
  font-size: 0.8125rem;
  color: #374151;
  line-height: 1.5;
`;

export default function BatchTracePage() {
  const [batchNumber, setBatchNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BatchTraceResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = batchNumber.trim();
    if (!value) {
      toast.error('Informe o número do lote');
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await batchService.trace(value);
      if (!res.success) {
        toast.error(res.message || 'Não foi possível rastrear o lote');
        return;
      }
      setResult(res.data);
    } catch (e: any) {
      if (e?.response?.status === 404) {
        toast.error('Lote não encontrado');
      } else {
        toast.error('Falha ao rastrear lote');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Rastrear lote</Title>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 0, marginBottom: 16 }}>
          Digite o número do lote para verificar se ele é válido e visualizar informações básicas de fabricação e validade.
        </p>

        <FormRow onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Ex: L2026-0001"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Consultando...' : 'Rastrear'}
          </Button>
        </FormRow>

        {result ? (
          <ResultBox $valid={result.isValid}>
            <ResultTitle $valid={result.isValid}>
              {result.isValid ? 'Lote válido' : 'Lote inválido ou não utilizável'}
            </ResultTitle>
            <ResultMeta>
              <div>
                <strong>Medicamento:</strong> {result.medicineName || '-'}
              </div>
              <div>
                <strong>Fabricação:</strong>{' '}
                {result.manufacturingDate ? new Date(result.manufacturingDate).toLocaleDateString('pt-BR') : '-'}
              </div>
              <div>
                <strong>Validade:</strong>{' '}
                {result.expiryDate ? new Date(result.expiryDate).toLocaleDateString('pt-BR') : '-'}
              </div>
              {!result.isValid ? (
                <div style={{ marginTop: 8, color: '#b91c1c' }}>
                  Este lote não é considerado válido para uso. Em caso de dúvida, procure a farmácia comunitária.
                </div>
              ) : null}
            </ResultMeta>
          </ResultBox>
        ) : null}
      </Card>
    </Page>
  );
}
