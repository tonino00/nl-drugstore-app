import { differenceInDays } from 'date-fns';
import styled from 'styled-components';

import { formatDate } from '../../utils/formatters';

const Box = styled.span<{ $warn: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $warn, theme }) => ($warn ? theme.colors.warning : theme.colors.grayLight)};
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export default function ExpiryAlert({ expiryDate }: { expiryDate?: string | null }) {
  if (!expiryDate) return <Box $warn={false}>Validade: -</Box>;

  const days = differenceInDays(new Date(expiryDate), new Date());
  const warn = days <= 30;

  return <Box $warn={warn}>Validade: {formatDate(expiryDate)}</Box>;
}
