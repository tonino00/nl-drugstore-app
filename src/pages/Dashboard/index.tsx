import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaHome, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';

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

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
          <Flex $gap="12px" $wrap>
            <ActionButton onClick={() => window.location.href = '/alerts'}>
              <FaBell />
              Alertas
            </ActionButton>
            <ActionButton onClick={() => window.location.href = '/profile'}>
              <FaUser />
              Perfil
            </ActionButton>
            <ActionButton onClick={logout} style={{ color: '#D32F2F' }}>
              <FaSignOutAlt />
              Sair
            </ActionButton>
          </Flex>
        </Flex>
      </PageHeader>

      {/* Seção Hero com KPIs */}
      <Card style={{ 
        background: '#2E7D32', 
        color: '#fff',
        borderRadius: '8px',
        padding: '32px'
      }}>
        <Flex $justify="between" $align="center" $wrap>
          <div style={{ flex: 1 }}>
            <Text $size="xl" $weight="bold" style={{ color: '#fff', marginBottom: '4px' }}>
              🏢 Farmácia NL - Sistema de Gestão
            </Text>
          </div>
          <div style={{ 
            textAlign: 'right',
            paddingLeft: '20px',
            marginLeft: '20px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ marginBottom: '6px' }}>
              <Text $size="lg" $weight="semibold" style={{ color: '#fff', lineHeight: '1' }}>
                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </div>
            <Text style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.2' }}>
              Última atualização
            </Text>
          </div>
        </Flex>
      </Card>

      <Spacer $size="lg" />

      {/* KPIs Principais */}
      <DashboardKPIs medicines={medicines} loading={loading} />
      
      <Spacer $size="lg" />

      {/* Gráficos e Alertas */}
      <ResponsiveGrid $columns={3}>
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
      <Card style={{ background: '#f8f9fa', textAlign: 'center' }}>
        <CardContent>
          <Text $size="sm" $color="#6B7280">
            © 2026 Farmácia NL - Sistema de Gestão Farmacêutica
          </Text>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
