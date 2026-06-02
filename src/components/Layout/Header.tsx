import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';

import NotificationBell from '../Notification/NotificationBell';
import { APP_NAME } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const Bar = styled.header`
  height: 64px;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin: 0;
  cursor: pointer;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.grayDark};
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 48px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 180px;
  z-index: 100;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.grayDark};
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  color: ${({ theme }) => theme.colors.grayDark};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <Bar>
      <Title as={Link} to="/medicines">{APP_NAME}</Title>

      <Right>
        <NotificationBell />
        <UserMenu ref={dropdownRef}>
          <UserTrigger onClick={() => setOpen((v) => !v)}>
            <FaUserCircle size={22} />
            <span>{user?.nome?.split(' ')[0] || 'Conta'}</span>
            <FaChevronDown size={12} />
          </UserTrigger>
          {open ? (
            <Dropdown>
              <DropdownItem to="/profile" onClick={() => setOpen(false)}>
                Perfil
              </DropdownItem>
              {user?.role === 'pharmacist' || user?.role === 'admin' ? (
                <DropdownItem to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </DropdownItem>
              ) : null}
              <DropdownButton onClick={() => { logout(); setOpen(false); }}>
                Sair
              </DropdownButton>
            </Dropdown>
          ) : null}
        </UserMenu>
      </Right>
    </Bar>
  );
}
