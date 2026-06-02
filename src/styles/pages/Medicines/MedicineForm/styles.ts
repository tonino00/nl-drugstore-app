import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.grayDark};
`;

export const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &.full-width {
    grid-column: 1 / -1;
  }
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};

  .required {
    color: ${({ theme }) => theme.colors.danger};
    margin-left: 2px;
  }
`;

export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayLight};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

export const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayLight};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.grayLight};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.black};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} 0;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

export const Error = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 2px;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'danger':
        return `
          background: '#fef2f2';
          color: ${theme.colors.danger};
          border-color: ${theme.colors.danger};

          &:hover:not(:disabled) {
            background: ${theme.colors.danger};
            color: ${theme.colors.white};
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.black};
          border-color: ${theme.colors.grayLight};

          &:hover:not(:disabled) {
            background: ${theme.colors.grayLight};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryDark};
            border-color: ${theme.colors.primaryDark};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
