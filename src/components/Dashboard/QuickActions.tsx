import { FaPlus, FaBox, FaChartBar, FaBell, FaDownload, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { ActionButton, PrimaryButton, Flex, ResponsiveGrid, Card, CardHeader, CardTitle, CardContent } from '../../styles/components/Stock/styles';

export default function QuickActions() {
  const { user, logout } = useAuth();

  const quickActions = [
    {
      title: 'Nova Entrada',
      description: 'Registrar entrada de medicamentos',
      icon: FaPlus,
      color: '#2E7D32',
      url: '/stock/inventory',
      primary: true,
    },
    {
      title: 'Gerenciar Estoque',
      description: 'Ver e controlar todos os itens',
      icon: FaBox,
      color: '#1976D2',
      url: '/stock/inventory',
      primary: false,
    },
    {
      title: 'Relatórios',
      description: 'Gerar relatórios e análises',
      icon: FaChartBar,
      color: '#7B1FA2',
      url: '/reports',
      primary: false,
    },
    {
      title: 'Alertas',
      description: 'Ver notificações e alertas',
      icon: FaBell,
      color: '#F57C00',
      url: '/alerts',
      primary: false,
    },
  ];

  const systemActions = [
    {
      title: 'Exportar Dados',
      description: 'Baixar dados em PDF/Excel',
      icon: FaDownload,
      color: '#616161',
      action: 'export',
    },
    {
      title: 'Usuários',
      description: 'Gerenciar usuários e permissões',
      icon: FaUsers,
      color: '#1976D2',
      url: '/users',
    },
    {
      title: 'Configurações',
      description: 'Ajustar preferências do sistema',
      icon: FaCog,
      color: '#6B7280',
      url: '/settings',
    },
    {
      title: 'Sair',
      description: 'Encerrar sessão',
      icon: FaSignOutAlt,
      color: '#D32F2F',
      action: 'logout',
    },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case 'export':
        // Implementar função de exportação
        window.print();
        break;
      case 'logout':
        logout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Ações Rápidas Principais */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveGrid $columns={2}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const ButtonComponent = action.primary ? PrimaryButton : ActionButton;
              
              return (
                <ButtonComponent
                  key={index}
                  onClick={() => {
                    if ('action' in action) {
                      handleAction((action as any).action);
                    } else if (action.url) {
                      window.location.href = action.url;
                    }
                  }}
                  style={{
                    padding: '16px',
                    minHeight: '80px',
                    flexDirection: 'column',
                    gap: '8px',
                    border: action.primary ? 'none' : `2px solid ${action.color}20`,
                    background: action.primary ? action.color : `${action.color}10`,
                    color: action.primary ? '#fff' : action.color,
                  }}
                >
                  <Icon size={24} />
                  <Flex $direction="column" $align="center" $gap="4px">
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>
                      {action.title}
                    </span>
                    <span style={{ fontSize: '11px', opacity: 0.8, textAlign: 'center' }}>
                      {action.description}
                    </span>
                  </Flex>
                </ButtonComponent>
              );
            })}
          </ResponsiveGrid>
        </CardContent>
      </Card>
    </>
  );
}
