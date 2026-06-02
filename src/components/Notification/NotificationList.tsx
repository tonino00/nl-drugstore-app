import styled from 'styled-components';
import type { Notification } from '../../types/notification.types';
import NotificationItem from './NotificationItem';

const List = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default function NotificationList({ items }: { items: Notification[] }) {
  return (
    <List>
      {items.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </List>
  );
}
