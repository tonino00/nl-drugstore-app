import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { FaBell, FaCheckCircle, FaClock, FaExclamationTriangle, FaSignOutAlt, FaUser } from 'react-icons/fa';

import { useAuth } from '../../hooks/useAuth';
import { medicineService } from '../../services/medicineService';
import type { Medicine } from '../../types/medicine.types';
import DashboardKPIs from '../../components/Dashboard/DashboardKPIs';
import DashboardCharts from '../../components/Dashboard/DashboardCharts';
import AlertsSection from '../../components/Dashboard/AlertsSection';
import QuickActions from '../../components/Dashboard/QuickActions';
import ExpiryAlertCard from '../../components/Dashboard/ExpiryAlertCard';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ResponsiveGrid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Flex,
  Text,
  Spacer,
  ActionButton,
} from '../../styles/components/Stock/styles';
import { theme } from '../../styles/theme';

const DashboardHeaderActions = styled(Flex)`
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;

    ${ActionButton} {
      min-height: 44px;
      flex: 1;
      justify-content: center;
    }
  }
`;

const LogoutButton = styled(ActionButton)`
  color: ${theme.colors.danger};

  &:hover {
    background: ${theme.colors.danger};
    border-color: ${theme.colors.danger};
    color: ${theme.colors.white};
  }
`;

const OperationalSummary = styled(Card)`
  padding: ${theme.spacing.lg};
  border-color: rgba(46, 125, 50, 0.18);
  background: linear-gradient(0deg, rgba(46, 125, 50, 0.04), rgba(46, 125, 50, 0.04)), ${theme.colors.white};

  &:hover {
    transform: none;
  }
`;

const SummaryContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const SummaryTitleGroup = styled.div`
  min-width: 240px;
  flex: 1;
`;

const SummaryTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: 1.3;
`;

const SummaryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSize.sm};
  line-height: 1.5;
`;

const SummaryStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const StatusPill = styled.div<{ $tone: 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-height: 36px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  background: ${({ $tone }) => ($tone === 'success' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(245, 124, 0, 0.1)')};
  color: ${({ $tone }) => ($tone === 'success' ? theme.colors.primaryDark : theme.colors.stockLow)};
`;

const TimeStamp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${theme.spacing.xs};
  padding-left: ${theme.spacing.md};
  border-left: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: flex-start;
    padding-left: 0;
    border-left: 0;
  }
`;

const FooterCard = styled(Card)`
  background: ${theme.colors.background};
  text-align: center;

  &:hover {
    transform: none;
  }
`;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await medicineService.list({ page: 1, limit: 100 });
        if (mounted) {
          setMedicines(data.items || []);
        }
      } catch {
        if (mounted) toast.error('Falha ao carregar dashboard');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Atualizar tempo a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (user?.role !== 'pharmacist' && user?.role !== 'admin') {
    return (
      <PageContainer>
        <PageHeader>
          <div>
            <PageTitle>Acesso Restrito</PageTitle>
            <PageSubtitle>Você não tem permissão para acessar o dashboard.</PageSubtitle>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const requiresAttention = medicines.some((medicine) => {
    const quantity = medicine.quantidade ?? 0;
    const minimum = medicine.quantidade_minima ?? 0;
    const expiry = medicine.validade ? new Date(medicine.validade) : null;
    const sevenDaysFromNow = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000);

    return quantity === 0 || quantity <= minimum || Boolean(expiry && expiry <= sevenDaysFromNow);
  });

  return (
    <PageContainer>
      {/* Header com perfil */}
      <PageHeader>
        <Flex $justify="between" $align="center" $wrap>
          <div>
            <PageTitle>Dashboard</PageTitle>
            <PageSubtitle>
              {getGreeting()}, {user?.nome}! • {formatDate(currentTime)}
            </PageSubtitle>
          </div>
          <DashboardHeaderActions $gap={theme.spacing.sm} $wrap>
            <ActionButton onClick={() => navigate('/alerts')} aria-label="Ver alertas">
              <FaBell />
              Alertas
            </ActionButton>
            <ActionButton onClick={() => navigate('/profile')} aria-label="Abrir perfil">
              <FaUser />
              Perfil
            </ActionButton>
            <LogoutButton onClick={logout} aria-label="Encerrar sessão">
              <FaSignOutAlt />
              Sair
            </LogoutButton>
          </DashboardHeaderActions>
        </Flex>
      </PageHeader>

      {/* Seção Hero com KPIs */}
      <OperationalSummary>
        <SummaryContent>
          <SummaryTitleGroup>
            <SummaryTitle>Farmácia NL, visão operacional</SummaryTitle>
            <SummaryMeta>
              <FaClock />
              Dados carregados para estoque, validade, lotes e alertas.
            </SummaryMeta>
          </SummaryTitleGroup>
          <SummaryStatus>
            <StatusPill $tone={requiresAttention ? 'warning' : 'success'}>
              {requiresAttention ? <FaExclamationTriangle /> : <FaCheckCircle />}
              {requiresAttention ? 'Itens exigem revisão' : 'Sem alertas urgentes'}
            </StatusPill>
            <TimeStamp>
              <Text $size="lg" $weight="semibold">
                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text $size="xs" $color={theme.colors.textSecondary}>
                Última atualização
              </Text>
            </TimeStamp>
          </SummaryStatus>
        </SummaryContent>
      </OperationalSummary>

      <Spacer $size="lg" />

      {/* KPIs Principais */}
      <DashboardKPIs medicines={medicines} loading={loading} />
      
      <Spacer $size="lg" />

      {/* Gráficos e Alertas */}
      <ResponsiveGrid $template="minmax(0, 2fr) minmax(0, 1fr)">
        <div>
          <DashboardCharts medicines={medicines} loading={loading} />
        </div>
        <div>
          <AlertsSection medicines={medicines} loading={loading} />
        </div>
      </ResponsiveGrid>

      <Spacer $size="lg" />

      {/* Ações Rápidas */}
      <QuickActions />

      <Spacer $size="lg" />

      {/* Card de Alertas de Lotes (mantendo o original) */}
      <ExpiryAlertCard />

      <Spacer $size="lg" />

      {/* Footer */}
      <FooterCard>
        <CardContent>
          <Text $size="sm" $color={theme.colors.textSecondary}>
            © 2026 Farmácia NL, Sistema de Gestão Farmacêutica
          </Text>
        </CardContent>
      </FooterCard>
    </PageContainer>
  );
}
