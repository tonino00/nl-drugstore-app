import { useMemo } from 'react';
import { FaExclamationTriangle, FaClock, FaBoxOpen, FaArrowRight, FaTimes } from 'react-icons/fa';
import type { Medicine } from '../../types/medicine.types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
  Flex,
  Text,
  ActionButton,
  Spacer,
} from '../../styles/components/Stock/styles';
import { batchService } from '../../services/batchService';
import type { Batch } from '../../types/batch.types';
import { useState, useEffect } from 'react';

interface AlertsSectionProps {
  medicines: Medicine[];
  loading?: boolean;
}

interface AlertItem {
  id: string | number;
  type: 'critical' | 'low' | 'expiring' | 'expired';
  title: string;
  subtitle: string;
  quantity?: number;
  days?: number;
  medicineId: number;
  action?: string;
  actionUrl?: string;
}

export default function AlertsSection({ medicines, loading = false }: AlertsSectionProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchesLoading, setBatchesLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setBatchesLoading(true);
        const res = await batchService.expiring(30);
        if (res.success && mounted) {
          setBatches(res.data.rows || []);
        }
      } finally {
        if (mounted) setBatchesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const alerts = useMemo((): AlertItem[] => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const alertList: AlertItem[] = [];

    // Medicamentos com estoque crítico
    medicines.forEach(medicine => {
      const quantity = medicine.quantidade ?? 0;
      const minimum = medicine.quantidade_minima ?? 0;
      const expiry = medicine.validade ? new Date(medicine.validade) : null;

      // Estoque zerado
      if (quantity === 0) {
        alertList.push({
          id: `critical-${medicine.id}`,
          type: 'critical',
          title: medicine.nome,
          subtitle: 'Estoque zerado - reposição urgente',
          medicineId: medicine.id,
          action: 'Repor',
          actionUrl: `/stock/manage/${medicine.id}`,
        });
      }
      // Estoque baixo
      else if (quantity <= minimum) {
        alertList.push({
          id: `low-${medicine.id}`,
          type: 'low',
          title: medicine.nome,
          subtitle: `Estoque baixo: ${quantity} unidades (mínimo: ${minimum})`,
          quantity,
          medicineId: medicine.id,
          action: 'Gerenciar',
          actionUrl: `/stock/manage/${medicine.id}`,
        });
      }
      // Vencido
      else if (expiry && expiry < now) {
        alertList.push({
          id: `expired-${medicine.id}`,
          type: 'expired',
          title: medicine.nome,
          subtitle: `Vencido em ${expiry.toLocaleDateString('pt-BR')}`,
          medicineId: medicine.id,
          action: 'Remover',
          actionUrl: `/medicines/${medicine.id}`,
        });
      }
      // Vencendo em 7 dias
      else if (expiry && expiry <= sevenDaysFromNow) {
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        alertList.push({
          id: `expiring-${medicine.id}`,
          type: 'expiring',
          title: medicine.nome,
          subtitle: `Vence em ${days} dia${days === 1 ? '' : 's'} (${expiry.toLocaleDateString('pt-BR')})`,
          days,
          medicineId: medicine.id,
          action: 'Ver',
          actionUrl: `/medicines/${medicine.id}`,
        });
      }
    });

    // Adicionar alertas de lotes
    batches.forEach(batch => {
      const days = typeof batch.daysUntilExpiry === 'number' 
        ? batch.daysUntilExpiry 
        : batch.expiryDate 
          ? Math.ceil((new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : null;

      if (typeof days === 'number' && days > 0 && days <= 7) {
        alertList.push({
          id: `batch-${batch.id}`,
          type: 'expiring',
          title: `Lote ${batch.batchNumber}`,
          subtitle: `${(batch as any).medicineName || `Medicamento #${batch.medicineId}`} - ${days} dia${days === 1 ? '' : 's'}`,
          days,
          quantity: batch.quantity,
          medicineId: batch.medicineId,
          action: 'Ver Estoque',
          actionUrl: `/stock/manage/${batch.medicineId}`,
        });
      }
    });

    // Ordenar por severidade
    const severityOrder = { critical: 0, expired: 1, expiring: 2, low: 3 };
    return alertList.sort((a, b) => severityOrder[a.type] - severityOrder[b.type]);
  }, [medicines, batches]);

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical': return FaExclamationTriangle;
      case 'expired': return FaTimes;
      case 'expiring': return FaClock;
      case 'low': return FaBoxOpen;
      default: return FaExclamationTriangle;
    }
  };

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical': return '#B71C1C';
      case 'expired': return '#616161';
      case 'expiring': return '#E65100';
      case 'low': return '#F57C00';
      default: return '#6B7280';
    }
  };

  const getAlertBg = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical': return 'rgba(183, 28, 28, 0.05)';
      case 'expired': return 'rgba(97, 97, 97, 0.05)';
      case 'expiring': return 'rgba(230, 81, 0, 0.05)';
      case 'low': return 'rgba(245, 124, 0, 0.05)';
      default: return 'rgba(107, 114, 128, 0.05)';
    }
  };

  if (loading || batchesLoading) {
    return (
      <Card>
        <CardContent>
          <Flex $justify="center" $align="center" style={{ minHeight: '200px' }}>
            <Text $color="#9CA3AF">Carregando alertas...</Text>
          </Flex>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🎉 Tudo em ordem!</CardTitle>
        </CardHeader>
        <CardContent>
          <Text $color="#6B7280">
            Nenhum alerta crítico no momento. Seu estoque está sob controle.
          </Text>
        </CardContent>
      </Card>
    );
  }

  // Separar alertas críticos dos demais
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' || alert.type === 'expired');
  const otherAlerts = alerts.filter(alert => alert.type !== 'critical' && alert.type !== 'expired');

  return (
    <>
      {/* Alertas Críticos */}
      {criticalAlerts.length > 0 && (
        <Card style={{ border: '2px solid #B71C1C', background: getAlertBg('critical') }}>
          <CardHeader>
            <CardTitle style={{ color: '#B71C1C' }}>
              ⚠️ Alertas Críticos ({criticalAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Flex $direction="column" $gap="12px">
              {criticalAlerts.slice(0, 3).map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <Flex
                    key={alert.id}
                    $align="center"
                    $gap="12px"
                    style={{
                      padding: '12px',
                      background: '#fff',
                      borderRadius: '8px',
                      border: '1px solid rgba(183, 28, 28, 0.2)',
                    }}
                  >
                    <Icon color={getAlertColor(alert.type)} size={20} />
                    <Flex $direction="column" $gap="4px" style={{ flex: 1 }}>
                      <Text $weight="semibold" $size="sm">
                        {alert.title}
                      </Text>
                      <Text $size="xs" $color="#6B7280">
                        {alert.subtitle}
                      </Text>
                    </Flex>
                    {alert.actionUrl && (
                      <ActionButton
                        onClick={() => window.location.href = alert.actionUrl!}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        {alert.action}
                        <FaArrowRight size={10} />
                      </ActionButton>
                    )}
                  </Flex>
                );
              })}
              {criticalAlerts.length > 3 && (
                <Text $size="xs" $color="#6B7280" style={{ textAlign: 'center' }}>
                  +{criticalAlerts.length - 3} outros alertas críticos
                </Text>
              )}
            </Flex>
          </CardContent>
        </Card>
      )}

      {/* Outros Alertas */}
      {otherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              📋 Outros Alertas ({otherAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Flex $direction="column" $gap="8px">
              {otherAlerts.slice(0, 5).map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <Flex
                    key={alert.id}
                    $align="center"
                    $gap="12px"
                    style={{
                      padding: '8px',
                      background: getAlertBg(alert.type),
                      borderRadius: '6px',
                      border: `1px solid ${getAlertColor(alert.type)}20`,
                    }}
                  >
                    <Icon color={getAlertColor(alert.type)} size={16} />
                    <Flex $direction="column" $gap="2px" style={{ flex: 1 }}>
                      <Text $size="sm" $weight="medium">
                        {alert.title}
                      </Text>
                      <Text $size="xs" $color="#6B7280">
                        {alert.subtitle}
                      </Text>
                    </Flex>
                    {alert.actionUrl && (
                      <ActionButton
                        onClick={() => window.location.href = alert.actionUrl!}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        {alert.action}
                      </ActionButton>
                    )}
                  </Flex>
                );
              })}
              {otherAlerts.length > 5 && (
                <Text $size="xs" $color="#6B7280" style={{ textAlign: 'center' }}>
                  +{otherAlerts.length - 5} outros alertas
                </Text>
              )}
            </Flex>
          </CardContent>
        </Card>
      )}
    </>
  );
}
