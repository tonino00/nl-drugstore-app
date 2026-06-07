import styled from 'styled-components';
import { theme } from '../../theme';

// Layout
export const PageWrap = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`;

export const PageTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md} 0;
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};

  @media (max-width: 480px) {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

export const Card = styled.div`
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.white};

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
  }
`;

export const SectionTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};

  @media (max-width: 480px) {
    font-size: ${theme.typography.fontSize.md};
  }
`;

// Status card
interface StatusCardProps {
  $state: 'open' | 'closed' | 'unknown';
}

export const StatusCard = styled.div<StatusCardProps>`
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  background: ${props =>
    props.$state === 'open' ? '#e8f5e9' : props.$state === 'closed' ? '#ffebee' : theme.colors.grayLight};

  @media (max-width: 480px) {
    padding: ${theme.spacing.md};
  }
`;

export const StatusEmoji = styled.div`
  font-size: 32px;
  margin-bottom: ${theme.spacing.sm};

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

interface StatusLabelProps {
  $open: boolean;
}

export const StatusLabel = styled.div<StatusLabelProps>`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${props => (props.$open ? '#2e7d32' : '#c62828')};
`;

export const StatusHint = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.grayDark};
  margin-top: ${theme.spacing.sm};
`;

// Tables (horizontal scroll on small screens)
export const TableScroll = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.fontSize.sm};
  min-width: 520px;
`;

export const Th = styled.th<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.border};
  text-align: ${props => props.$align || 'left'};
  white-space: nowrap;
`;

export const Td = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${theme.spacing.sm};
  text-align: ${props => props.$align || 'left'};
  vertical-align: middle;
`;

export const Badge = styled.span<{ $open: boolean }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  white-space: nowrap;
  color: ${props => (props.$open ? '#16a34a' : '#dc2626')};
  background: ${props => (props.$open ? '#f0fdf4' : '#fef2f2')};
`;

// Buttons
export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};

  @media (max-width: 480px) {
    flex-direction: column-reverse;
  }
`;

export const PrimaryBtn = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  cursor: pointer;
  font-weight: ${theme.typography.fontWeight.medium};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SecondaryBtn = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  cursor: pointer;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SmallBtn = styled.button`
  padding: 4px 10px;
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  white-space: nowrap;
`;

// Holidays header
export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Modal
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: ${theme.spacing.md};

  @media (max-width: 480px) {
    align-items: flex-end;
    padding: 0;
  }
`;

export const ModalBox = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 420px;
  max-height: calc(100vh - 2 * ${theme.spacing.md});
  overflow-y: auto;

  @media (max-width: 480px) {
    max-width: 100%;
    max-height: 90vh;
    border-radius: ${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0;
    padding: ${theme.spacing.md};
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
`;

export const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
  color: ${theme.colors.textSecondary};
`;

export const Field = styled.div`
  margin-bottom: ${theme.spacing.sm};
`;

export const FieldLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const TextInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  margin-top: ${theme.spacing.xs};
  box-sizing: border-box;
`;

// Row that holds time inputs separated by "às" — wraps on small screens
export const TimeRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  margin-top: ${theme.spacing.xs};
  flex-wrap: wrap;
`;

export const TimeInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  flex: 1;
  min-width: 110px;
`;

export const RadioGroup = styled.div<{ $column?: boolean }>`
  display: flex;
  flex-direction: ${props => (props.$column ? 'column' : 'row')};
  gap: ${props => (props.$column ? theme.spacing.sm : theme.spacing.md)};
  margin-top: ${theme.spacing.xs};
  flex-wrap: wrap;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
`;

export const Muted = styled.p`
  color: ${theme.colors.gray};
  margin: 0;
`;
