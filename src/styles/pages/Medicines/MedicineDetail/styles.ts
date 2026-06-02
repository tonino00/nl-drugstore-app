import styled from 'styled-components';

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

export const Btn = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;
