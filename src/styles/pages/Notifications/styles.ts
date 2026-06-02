import styled from 'styled-components';

export const Bar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Button = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;
