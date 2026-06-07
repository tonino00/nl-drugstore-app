import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from './Header';
import Sidebar from './Sidebar';

const Shell = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 76px 1fr;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  /* Permite que o item do grid encolha abaixo da largura intrínseca do
     conteúdo, fazendo os contêineres com overflow rolarem internamente em
     vez de transbordarem a página no mobile. */
  min-width: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  background: ${({ theme }) => theme.colors.white};
`;

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Shell>
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <Main>
        <Header onMenuToggle={() => setMobileMenuOpen((v) => !v)} />
        <Content>
          <Outlet />
        </Content>
        <Footer />
      </Main>
    </Shell>
  );
}
