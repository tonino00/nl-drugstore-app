import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaPills, FaHeart, FaBell, FaClock, FaChartLine, FaBoxes, FaSignOutAlt, FaPlusCircle, FaTimes, FaSearch } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';

const Aside = styled.aside<{ $isOpen: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.grayLight};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: fixed;
    inset: 0 auto 0 0;
    width: 260px;
    z-index: 300;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform 0.25s ease;
    border-right: 1px solid ${({ theme }) => theme.colors.grayLight};
    box-shadow: ${({ $isOpen, theme }) => ($isOpen ? theme.shadows.lg : 'none')};
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 250;
  }
`;

const CloseBtn = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayDark};
  padding: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: inline-flex;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.grayDark};

  &.active {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  span {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: inline;
    }
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  span {
    @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
      display: none;
    }

    @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
      display: inline;
    }
  }
`;

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = (user?.role || '').toLowerCase();
  const isPharmacist = role === 'pharmacist' || role === 'pharmaceutical' || role === 'farmacêutico' || role === 'admin';

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Aside $isOpen={isOpen}>
        <CloseBtn type="button" onClick={onClose} aria-label="Fechar menu">
          <FaTimes size={18} />
        </CloseBtn>
        <Nav>
          {isPharmacist && (
            <Item to="/dashboard" onClick={onClose}>
              <FaChartLine />
              <span>Dashboard</span>
            </Item>
          )}

          <Item to="/medicines" end onClick={onClose}>
            <FaPills />
            <span>Medicamentos</span>
          </Item>

          {isPharmacist && (
            <Item to="/medicines/new" onClick={onClose}>
              <FaPlusCircle />
              <span>Cadastrar</span>
            </Item>
          )}

          {!isPharmacist && (
            <>
              <Item to="/favorites" onClick={onClose}>
                <FaHeart />
                <span>Favoritos</span>
              </Item>
              <Item to="/batch-trace" onClick={onClose}>
                <FaSearch />
                <span>Rastrear lote</span>
              </Item>
            </>
          )}

          <Item to="/notifications" onClick={onClose}>
            <FaBell />
            <span>Notificações</span>
          </Item>

          {isPharmacist && (
            <Item to="/pharmacy-hours" onClick={onClose}>
              <FaClock />
              <span>Horário</span>
            </Item>
          )}

          {isPharmacist && (
            <>
              <Divider />
              <Item to="/stock/inventory" onClick={onClose}>
                <FaBoxes />
                <span>Estoque</span>
              </Item>
            </>
          )}

          <Divider />
          <LogoutBtn type="button" onClick={() => { logout(); onClose?.(); }}>
            <FaSignOutAlt />
            <span>Sair</span>
          </LogoutBtn>
        </Nav>
      </Aside>
    </>
  );
}
