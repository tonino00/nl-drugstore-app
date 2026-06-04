import styled from 'styled-components';
import { theme } from '../../theme';

// Page Layout
export const PageContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  background: ${theme.colors.background};
  min-height: 100vh;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.md};
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  line-height: 1.2;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

export const PageSubtitle = styled.p`
  margin: ${theme.spacing.xs} 0 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.md};
  line-height: 1.5;
`;

// Dashboard Cards
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

interface MetricCardProps {
  color?: string;
}

export const MetricCard = styled.div<MetricCardProps>`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || theme.colors.primary};
  }
`;

export const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

export const MetricTitle = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.025em;
  line-height: 1.4;
`;

interface MetricIconProps {
  background?: string;
  color?: string;
}

export const MetricIcon = styled.div<MetricIconProps>`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background || theme.colors.grayLight};
  color: ${props => props.color || theme.colors.primary};
  font-size: 20px;
`;

export const MetricValue = styled.div`
  font-size: ${theme.typography.fontSize.xxl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.textPrimary};
  line-height: 1.2;
  margin-bottom: ${theme.spacing.xs};
`;

interface MetricChangeProps {
  $positive?: boolean;
}

export const MetricChange = styled.div<MetricChangeProps>`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${props => props.$positive ? theme.colors.success : theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Stock Table
export const TableContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
`;

export const TableHeader = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.md};
  }
`;

export const TableTitle = styled.h2`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
`;

export const TableActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    justify-content: stretch;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 320px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    max-width: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md} ${theme.spacing.sm} 40px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing.sm};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textTertiary};
  pointer-events: none;
`;

export const FilterButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.hover};
    border-color: ${theme.colors.primary};
    color: ${theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const ExportButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// Table Styles
export const StyledTable = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.fontSize.sm};
`;

export const TableHead = styled.thead`
  background: ${theme.colors.grayLight};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background: ${theme.colors.hover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeaderCell = styled.th`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  text-align: left;
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs};
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

export const TableCell = styled.td`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  vertical-align: middle;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

// Status Badges
interface StatusBadgeProps {
  $status: 'critical' | 'low' | 'normal' | 'expired' | 'expiring';
}

export const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.circle};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.025em;
  white-space: nowrap;

  ${props => {
    switch (props.$status) {
      case 'critical':
        return `
          background: rgba(183, 28, 28, 0.1);
          color: ${theme.colors.stockCritical};
        `;
      case 'low':
        return `
          background: rgba(245, 124, 0, 0.1);
          color: ${theme.colors.stockLow};
        `;
      case 'normal':
        return `
          background: rgba(46, 125, 50, 0.1);
          color: ${theme.colors.stockNormal};
        `;
      case 'expired':
        return `
          background: rgba(97, 97, 97, 0.1);
          color: ${theme.colors.stockExpired};
        `;
      case 'expiring':
        return `
          background: rgba(230, 81, 0, 0.1);
          color: ${theme.colors.stockExpiring};
        `;
      default:
        return `
          background: ${theme.colors.grayLight};
          color: ${theme.colors.gray};
        `;
    }
  }}
`;

// Stock Progress Bar
export const StockProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

interface StockProgressBarProps {
  $percentage: number;
  $status: 'critical' | 'low' | 'normal';
}

export const StockProgressBar = styled.div<StockProgressBarProps>`
  width: 80px;
  height: 8px;
  background: ${theme.colors.grayLight};
  border-radius: ${theme.borderRadius.circle};
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$percentage}%;
    background: ${props => {
      switch (props.$status) {
        case 'critical': return theme.colors.stockCritical;
        case 'low': return theme.colors.stockLow;
        default: return theme.colors.stockNormal;
      }
    }};
    transition: width 0.3s ease;
  }
`;

export const StockText = styled.span`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textSecondary};
  min-width: 35px;
`;

// Action Buttons
export const ActionButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.white};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    text-decoration: none;
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface PrimaryButtonProps {
  $loading?: boolean;
}

export const PrimaryButton = styled.button<PrimaryButtonProps>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  &:hover {
    background: ${theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.$loading && `
    pointer-events: none;
    opacity: 0.7;
  `}
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.textSecondary};
`;

export const EmptyStateIcon = styled.div`
  font-size: 48px;
  color: ${theme.colors.textTertiary};
  margin-bottom: ${theme.spacing.lg};
`;

export const EmptyStateTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
`;

export const EmptyStateText = styled.p`
  margin: 0;
  font-size: ${theme.typography.fontSize.md};
  line-height: 1.5;
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.textSecondary};
`;

export const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${theme.colors.grayLight};
  border-top: 3px solid ${theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: ${theme.spacing.sm};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Chart Container
export const ChartContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.lg};
`;

export const ChartTitle = styled.h3`
  margin: 0 0 ${theme.spacing.lg} 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
`;

// Responsive Grid
interface ResponsiveGridProps {
  $columns?: number;
}

export const ResponsiveGrid = styled.div<ResponsiveGridProps>`
  display: grid;
  grid-template-columns: ${props => props.$columns ? `repeat(${props.$columns}, 1fr)` : 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

// Card Component
export const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.md};
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.textPrimary};
`;

export const CardContent = styled.div`
  color: ${theme.colors.textSecondary};
  line-height: 1.6;
`;

// Form Elements
export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.textPrimary};
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.textTertiary};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  background: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }
`;

export const FormError = styled.div`
  color: ${theme.colors.danger};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-top: ${theme.spacing.xs};
`;

// Utility Components
interface FlexProps {
  $direction?: 'row' | 'column';
  $align?: 'start' | 'center' | 'end';
  $justify?: 'start' | 'center' | 'end' | 'between';
  $gap?: string;
  $wrap?: boolean;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  align-items: ${props => props.$align || 'center'};
  justify-content: ${props => props.$justify || 'start'};
  gap: ${props => props.$gap || theme.spacing.sm};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

interface TextProps {
  $size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  $weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  $color?: string;
}

export const Text = styled.span<TextProps>`
  font-size: ${props => props.$size ? theme.typography.fontSize[props.$size] : theme.typography.fontSize.md};
  font-weight: ${props => props.$weight ? theme.typography.fontWeight[props.$weight] : theme.typography.fontWeight.normal};
  color: ${props => props.$color || theme.colors.textPrimary};
  line-height: 1.5;
`;

interface SpacerProps {
  $size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Spacer = styled.div<SpacerProps>`
  height: ${props => theme.spacing[props.$size || 'md']};
`;
