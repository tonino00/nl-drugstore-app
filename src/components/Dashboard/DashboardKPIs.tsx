import { useMemo } from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaClock, FaChartLine, FaPills, FaWarehouse } from 'react-icons/fa';
import type { Medicine } from '../../types/medicine.types';
import {
  ResponsiveGrid,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  MetricHeader,
  MetricTitle,
  MetricIcon,
  MetricValue,
  MetricChange,
  Flex,
  Text,
} from '../../styles/components/Stock/styles';

interface DashboardKPIsProps {
  medicines: Medicine[];
  loading?: boolean;
}

interface KPIMetrics {
  totalMedicines: number;
  totalItems: number;
  lowStockItems: number;
  criticalItems: number;
  expiring7Days: number;
  expiring30Days: number;
  expiredItems: number;
  totalValue: number;
  categoriesCount: number;
}

export default function DashboardKPIs({ medicines, loading = false }: DashboardKPIsProps) {
  const metrics = useMemo((): KPIMetrics => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return medicines.reduce(
      (acc, medicine) => {
        const quantity = medicine.quantidade ?? 0;
        const minimum = medicine.quantidade_minima ?? 0;
        const expiry = medicine.validade ? new Date(medicine.validade) : null;

        // Contagem total
        acc.totalMedicines += 1;
        acc.totalItems += quantity;

        // Valor estimado (preço médio simulado)
        const estimatedPrice = 15; // Preço médio estimado
        acc.totalValue += quantity * estimatedPrice;

        // Status do estoque
        if (quantity === 0) {
          acc.criticalItems++;
        } else if (quantity <= minimum) {
          acc.lowStockItems++;
        }

        // Status de validade
        if (expiry) {
          if (expiry < now) {
            acc.expiredItems++;
          } else if (expiry <= sevenDaysFromNow) {
            acc.expiring7Days++;
          } else if (expiry <= thirtyDaysFromNow) {
            acc.expiring30Days++;
          }
        }

        // Contagem de categorias (simulado - você pode adicionar campo de categoria)
        acc.categoriesCount = Math.max(acc.categoriesCount, 1);

        return acc;
      },
      {
        totalMedicines: 0,
        totalItems: 0,
        lowStockItems: 0,
        criticalItems: 0,
        expiring7Days: 0,
        expiring30Days: 0,
        expiredItems: 0,
        totalValue: 0,
        categoriesCount: 0,
      }
    );
  }, [medicines]);

  const kpiCards = [
    {
      title: 'Total de Medicamentos',
      value: metrics.totalMedicines.toLocaleString('pt-BR'),
      subtitle: 'Diferentes produtos',
      icon: FaPills,
      color: '#2E7D32',
      background: 'rgba(46, 125, 50, 0.1)',
      change: null,
      trend: null,
    },
    {
      title: 'Itens em Estoque',
      value: metrics.totalItems.toLocaleString('pt-BR'),
      subtitle: 'Unidades totais',
      icon: FaWarehouse,
      color: '#1976D2',
      background: 'rgba(25, 118, 210, 0.1)',
      change: null,
      trend: null,
    },
    {
      title: 'Valor do Estoque',
      value: `R$ ${metrics.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Valor estimado',
      icon: FaChartLine,
      color: '#7B1FA2',
      background: 'rgba(123, 31, 162, 0.1)',
      change: null,
      trend: null,
    },
    {
      title: 'Alertas Críticos',
      value: (metrics.criticalItems + metrics.expiredItems + metrics.expiring7Days).toString(),
      subtitle: 'Requerem atenção',
      icon: FaExclamationTriangle,
      color: '#D32F2F',
      background: 'rgba(211, 47, 47, 0.1)',
      change: metrics.criticalItems > 0 ? { value: 'Ação necessária!', positive: false } : null,
      trend: 'down',
    },
    {
      title: 'Estoque Baixo',
      value: metrics.lowStockItems.toString(),
      subtitle: 'Abaixo do mínimo',
      icon: FaBoxOpen,
      color: '#F57C00',
      background: 'rgba(245, 124, 0, 0.1)',
      change: metrics.lowStockItems > 0 ? { value: 'Atenção!', positive: false } : null,
      trend: 'down',
    },
    {
      title: 'Vencendo em 7 dias',
      value: metrics.expiring7Days.toString(),
      subtitle: 'Validade próxima',
      icon: FaClock,
      color: '#E65100',
      background: 'rgba(230, 81, 0, 0.1)',
      change: metrics.expiring7Days > 0 ? { value: 'Verificar!', positive: false } : null,
      trend: 'down',
    },
  ];

  if (loading) {
    return (
      <ResponsiveGrid $columns={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent>
              <Flex $justify="center" $align="center" style={{ height: '120px' }}>
                <Text $color="#9CA3AF">Carregando...</Text>
              </Flex>
            </CardContent>
          </Card>
        ))}
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid $columns={3}>
      {kpiCards.map((card, index) => (
        <Card key={index}>
          <CardHeader>
            <MetricHeader>
              <MetricTitle>{card.title}</MetricTitle>
              <MetricIcon background={card.background} color={card.color}>
                <card.icon />
              </MetricIcon>
            </MetricHeader>
          </CardHeader>
          <CardContent>
            <MetricValue>{card.value}</MetricValue>
            <Text $size="sm" $color="#6B7280">
              {card.subtitle}
            </Text>
            {card.change && (
              <MetricChange $positive={card.change.positive}>
                {card.change.value}
              </MetricChange>
            )}
          </CardContent>
        </Card>
      ))}
    </ResponsiveGrid>
  );
}
