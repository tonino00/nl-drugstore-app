import styled from 'styled-components';
import type { Notification, NotificationType } from '../../types/notification.types';
import { formatDate } from '../../utils/formatters';

const TYPE_CONFIG: Record<NotificationType, { label: string; color: string; bg: string }> = {
  stock: { label: 'Estoque', color: '#d97706', bg: '#fffbeb' },
  expiry: { label: 'Validade', color: '#dc2626', bg: '#fef2f2' },
  favorite_restock: { label: 'Favorito', color: '#7c3aed', bg: '#f3e8ff' },
  system: { label: 'Sistema', color: '#2563eb', bg: '#eff6ff' },
  sla_warning: { label: 'SLA', color: '#ea580c', bg: '#fff7ed' },
};

const Item = styled.div<{ $read: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ $read, theme }) => ($read ? theme.colors.white : '#fafafa')};
  transition: background 0.15s;
  cursor: default;

  &:hover {
    background: #f9fafb;
  }
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  margin-top: 6px;
`;

const Placeholder = styled.div`
  width: 8px;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Title = styled.div<{ $read: boolean }>`
  font-weight: ${({ $read, theme }) => ($read ? theme.typography.fontWeight.medium : theme.typography.fontWeight.semibold)};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.grayDark};
`;

const Body = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.grayDark};
  line-height: 1.5;
`;

const Badge = styled.span<{ $color: string; $bg: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $bg }) => $bg};
`;

const Meta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: #9e9e9e;
`;

export default function NotificationItem({ notification }: { notification: Notification }) {
  const typeConfig = TYPE_CONFIG[notification.type];
  return (
    <Item $read={notification.read}>
      {notification.read ? <Placeholder /> : <UnreadDot />}
      <Content>
        <Row>
          <Title $read={notification.read}>{notification.title}</Title>
          <Badge $color={typeConfig.color} $bg={typeConfig.bg}>{typeConfig.label}</Badge>
        </Row>
        <Body>{notification.body}</Body>
        <Meta>{formatDate(notification.created_at)}</Meta>
      </Content>
    </Item>
  );
}
