import { useMemo } from 'react';
import { FaBoxOpen, FaExclamationTriangle, FaChartLine, FaClock } from 'react-icons/fa';
import type { Medicine } from '../../types/medicine.types';
import {
  DashboardGrid,
  MetricCard,
  MetricHeader,
  MetricTitle,
  MetricIcon,
  MetricValue,
  MetricChange,
} from '../../styles/components/Stock/styles';

interface DashboardCardsProps {
  medicines: Medicine[];
}

interface StockMetrics {
  totalItems: number;
  totalValue: number;
  criticalItems: number;
  lowStockItems: number;
  expiredItems: number;
  expiringItems: number;
  normalItems: number;
}

export default function DashboardCards({ medicines }: DashboardCardsProps) {
  const metrics = useMemo((): StockMetrics => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return medicines.reduce(
      (acc, medicine) => {
        const quantity = medicine.quantidade ?? 0;
        const minimum = medicine.quantidade_minima ?? 0;
        const expiry = medicine.validade ? new Date(medicine.validade) : null;

        // Contagem total de itens
        acc.totalItems += quantity;

        // Cálculo do valor (simulado - você pode adicionar campo de preço)
        const estimatedPrice = 10; // Preço médio estimado
        acc.totalValue += quantity * estimatedPrice;

        // Status do estoque
        if (quantity === 0) {
          acc.criticalItems++;
        } else if (quantity <= minimum) {
          acc.lowStockItems++;
        } else {
          acc.normalItems++;
        }

        // Status de validade
        if (expiry) {
          if (expiry < now) {
            acc.expiredItems++;
          } else if (expiry <= thirtyDaysFromNow) {
            acc.expiringItems++;
          }
        }

        return acc;
      },
      {
        totalItems: 0,
        totalValue: 0,
        criticalItems: 0,
        lowStockItems: 0,
        expiredItems: 0,
        expiringItems: 0,
        normalItems: 0,
      }
    );
  }, [medicines]);

  const cards = [
    {
      title: 'Total de Itens',
      value: metrics.totalItems.toLocaleString('pt-BR'),
      subtitle: 'Em estoque',
      icon: FaBoxOpen,
      color: '#2E7D32',
      background: 'rgba(46, 125, 50, 0.1)',
      change: null,
    },
    {
      title: 'Valor Estimado',
      value: `R$ ${metrics.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Valor total do estoque',
      icon: FaChartLine,
      color: '#1976D2',
      background: 'rgba(25, 118, 210, 0.1)',
      change: null,
    },
    {
      title: 'Itens Críticos',
      value: metrics.criticalItems.toString(),
      subtitle: 'Sem estoque',
      icon: FaExclamationTriangle,
      color: '#B71C1C',
      background: 'rgba(183, 28, 28, 0.1)',
      change: metrics.criticalItems > 0 ? { value: 'Atenção!', positive: false } : null,
    },
    {
      title: 'Vencendo em 30 dias',
      value: metrics.expiringItems.toString(),
      subtitle: 'Próximos do vencimento',
      icon: FaClock,
      color: '#E65100',
      background: 'rgba(230, 81, 0, 0.1)',
      change: metrics.expiringItems > 0 ? { value: 'Verificar!', positive: false } : null,
    },
  ];

  return (
    <DashboardGrid>
      {cards.map((card, index) => (
        <MetricCard key={index} color={card.color}>
          <MetricHeader>
            <MetricTitle>{card.title}</MetricTitle>
            <MetricIcon background={card.background} color={card.color}>
              <card.icon />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{card.value}</MetricValue>
          <Text $size="sm" $color="#6B7280">
            {card.subtitle}
          </Text>
          {card.change && (
            <MetricChange $positive={card.change.positive}>
              {card.change.value}
            </MetricChange>
          )}
        </MetricCard>
      ))}
    </DashboardGrid>
  );
}

// Import necessário para o componente Text
import { Text } from '../../styles/components/Stock/styles';
