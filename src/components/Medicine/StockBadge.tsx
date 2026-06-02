import styled from 'styled-components';

const Badge = styled.span<{ $ok: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $ok, theme }) => ($ok ? theme.colors.success : theme.colors.danger)};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export default function StockBadge({ quantity }: { quantity: number }) {
  const ok = quantity > 0;
  return <Badge $ok={ok}>Estoque: {quantity}</Badge>;
}
