import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaPills, FaHeart, FaBell, FaClock, FaChartLine, FaBoxes, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';

const Aside = styled.aside`
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.grayLight};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
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
`;

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = (user?.role || '').toLowerCase();
  const isPharmacist = role === 'pharmacist' || role === 'pharmaceutical' || role === 'farmacêutico' || role === 'admin';

  return (
    <Aside>
      <Nav>
        {isPharmacist && (
          <Item to="/dashboard">
            <FaChartLine />
            <span>Dashboard</span>
          </Item>
        )}

        <Item to="/medicines" end>
          <FaPills />
          <span>Medicamentos</span>
        </Item>

        {isPharmacist && (
          <Item to="/medicines/new">
            <FaPlusCircle />
            <span>Cadastrar</span>
          </Item>
        )}

        {!isPharmacist && (
          <Item to="/favorites">
            <FaHeart />
            <span>Favoritos</span>
          </Item>
        )}

        <Item to="/notifications">
          <FaBell />
          <span>Notificações</span>
        </Item>

        {isPharmacist && (
          <Item to="/pharmacy-hours">
            <FaClock />
            <span>Horário</span>
          </Item>
        )}

        {isPharmacist && (
          <>
            <Divider />
            <Item to="/stock/inventory">
              <FaBoxes />
              <span>Estoque</span>
            </Item>
          </>
        )}

        <Divider />
        <LogoutBtn type="button" onClick={logout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </LogoutBtn>
      </Nav>
    </Aside>
  );
}
