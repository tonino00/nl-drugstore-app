import styled from 'styled-components';

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.background}, ${theme.colors.grayLight})`};
`;

export const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Header = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h2`
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Row = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const Label = styled.label`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const Field = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15);
  }
`;

export const PasswordWrap = styled.div`
  position: relative;
`;

export const PasswordField = styled(Field)`
  padding-right: 44px;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayDark};

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

export const Error = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Links = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.grayDark};
`;
