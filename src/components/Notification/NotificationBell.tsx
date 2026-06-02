import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

import { useAppSelector } from '../../store/hooks';

const Wrap = styled(Link)`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
`;

const Badge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

export default function NotificationBell() {
  const unread = useAppSelector((s) => s.notifications.unreadCount);

  return (
    <Wrap to="/notifications" aria-label="Notificações">
      <FaBell />
      {unread > 0 ? <Badge>{unread > 99 ? '99+' : unread}</Badge> : null}
    </Wrap>
  );
}
