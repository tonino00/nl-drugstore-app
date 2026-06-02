import styled from 'styled-components';

export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

export const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;
