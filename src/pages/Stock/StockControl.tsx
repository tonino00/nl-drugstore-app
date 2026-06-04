import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaChartLine, FaExclamationTriangle, FaClock } from 'react-icons/fa';

import type { Medicine } from '../../types/medicine.types';
import { medicineService, type StockMovement } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';
import MovementForm from '../../components/Stock/MovementForm';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ResponsiveGrid,
  StatusBadge,
  Flex,
  Text,
  ActionButton,
  ChartContainer,
  ChartTitle,
  Spacer,
} from '../../styles/components/Stock/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function StockControlPage() {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMovements, setLoadingMovements] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!medicineId) return;
        setLoading(true);
        setLoadingMovements(true);
        
        // Carregar dados do medicamento
        const medicineData = await medicineService.getById(medicineId);
        if (mounted) setMedicine(medicineData);
        
        // Carregar movimentações recentes
        try {
          const movementsData = await medicineService.movements(medicineId, { page: 1, limit: 10 });
          if (mounted) setMovements(movementsData.items || []);
        } catch (error) {
          // Silencioso se não houver movimentações
          if (mounted) setMovements([]);
        }
      } catch {
        toast.error('Falha ao carregar medicamento');
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingMovements(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [medicineId]);

  if (!isStaff) {
    return (
      <PageContainer>
        <PageHeader>
          <div>
            <PageTitle>Controle de estoque</PageTitle>
            <Text $color="#6B7280">Acesso restrito.</Text>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  // Função para determinar o status do estoque
  const getStockStatus = (medicine: Medicine): 'critical' | 'low' | 'normal' | 'expired' | 'expiring' => {
    const quantity = medicine.quantidade ?? 0;
    const minimum = medicine.quantidade_minima ?? 0;
    const expiry = medicine.validade ? new Date(medicine.validade) : null;
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry && expiry < now) return 'expired';
    if (quantity === 0) return 'critical';
    if (quantity <= minimum) return 'low';
    if (expiry && expiry <= thirtyDaysFromNow) return 'expiring';
    return 'normal';
  };

  // Dados para o gráfico de histórico
  const chartData = useMemo(() => {
    if (!movements.length) return [];
    
    // Agrupar movimentações por dia
    const dailyData = new Map<string, { entrada: number; saida: number; saldo: number }>();
    let currentBalance = medicine?.quantidade || 0;
    
    // Processar movimentações em ordem cronológica inversa
    const sortedMovements = [...movements].reverse();
    
    sortedMovements.forEach(movement => {
      const date = new Date(movement.created_at).toLocaleDateString('pt-BR');
      
      if (!dailyData.has(date)) {
        dailyData.set(date, { entrada: 0, saida: 0, saldo: currentBalance });
      }
      
      const data = dailyData.get(date)!;
      
      if (movement.tipo === 'entrada') {
        data.entrada += movement.quantidade;
        currentBalance += movement.quantidade;
      } else if (movement.tipo === 'saida') {
        data.saida += movement.quantidade;
        currentBalance -= movement.quantidade;
      }
      
      data.saldo = currentBalance;
    });
    
    return Array.from(dailyData.entries())
      .map(([date, data]) => ({ date, ...data }))
      .slice(-7); // Últimos 7 dias
  }, [movements, medicine?.quantidade]);

  // Métricas calculadas
  const metrics = useMemo(() => {
    if (!medicine) return null;
    
    const status = getStockStatus(medicine);
    const quantity = medicine.quantidade ?? 0;
    const minimum = medicine.quantidade_minima ?? 0;
    const percentage = minimum > 0 ? Math.min((quantity / minimum) * 100, 100) : 100;
    
    // Calcular dias de estoque baseado no histórico
    const recentMovements = movements.filter(m => {
      const movementDate = new Date(m.created_at);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return movementDate >= thirtyDaysAgo;
    });
    
    const totalSaid = recentMovements
      .filter(m => m.tipo === 'saida')
      .reduce((sum, m) => sum + m.quantidade, 0);
    
    const dailyAverage = totalSaid / 30; // Média diária dos últimos 30 dias
    const daysOfStock = dailyAverage > 0 ? Math.floor(quantity / dailyAverage) : 0;
    
    return {
      status,
      quantity,
      minimum,
      percentage,
      daysOfStock,
      recentMovements: recentMovements.length,
    };
  }, [medicine, movements]);

  const handleUpdated = (updated: Medicine) => {
    setMedicine(updated);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Flex $align="center" $gap="16px">
          <ActionButton onClick={() => navigate(`/medicines/${medicineId}`)}>
            <FaArrowLeft />
            Voltar
          </ActionButton>
          <div>
            <PageTitle>Controle de Estoque</PageTitle>
            <Text $color="#6B7280">
              {medicine?.nome || 'Carregando...'}
            </Text>
          </div>
        </Flex>
      </PageHeader>

      {loading ? (
        <Flex $justify="center" $align="center" style={{ minHeight: '200px' }}>
          <Text>Carregando...</Text>
        </Flex>
      ) : medicine && metrics ? (
        <>
          {/* Cards de Informações */}
          <ResponsiveGrid $columns={4}>
            <Card>
              <CardHeader>
                <CardTitle>Estoque Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <Text $size="xxl" $weight="bold" $color="#1976D2">
                  {metrics.quantity}
                </Text>
                <Text $size="sm" $color="#6B7280">
                  Unidades disponíveis
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estoque Mínimo</CardTitle>
              </CardHeader>
              <CardContent>
                <Text $size="xxl" $weight="bold" $color="#2E7D32">
                  {metrics.minimum}
                </Text>
                <Text $size="sm" $color="#6B7280">
                  Nível mínimo seguro
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBadge $status={metrics.status}>
                  {metrics.status === 'critical' ? 'CRÍTICO' :
                   metrics.status === 'low' ? 'BAIXO' :
                   metrics.status === 'normal' ? 'NORMAL' :
                   metrics.status === 'expired' ? 'VENCIDO' : 'VENCENDO'}
                </StatusBadge>
                <Spacer $size="xs" />
                <Text $size="sm" $color="#6B7280">
                  {metrics.percentage.toFixed(0)}% do mínimo
                </Text>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dias de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <Flex $align="center" $gap="8px">
                  <Text $size="xxl" $weight="bold" $color="#F57C00">
                    {metrics.daysOfStock}
                  </Text>
                  <FaClock color="#F57C00" />
                </Flex>
                <Text $size="sm" $color="#6B7280">
                  Baseado na média de consumo
                </Text>
              </CardContent>
            </Card>
          </ResponsiveGrid>

          <Spacer $size="lg" />

          {/* Alertas */}
          {(metrics.status === 'critical' || metrics.status === 'expiring' || metrics.status === 'expired') && (
            <Card style={{ border: '2px solid #B71C1C', background: 'rgba(183, 28, 28, 0.05)' }}>
              <CardContent>
                <Flex $align="center" $gap="12px">
                  <FaExclamationTriangle color="#B71C1C" size={24} />
                  <div>
                    <Text $weight="semibold" $color="#B71C1C">
                      {metrics.status === 'critical' ? 'Estoque Crítico!' :
                       metrics.status === 'expired' ? 'Medicamento Vencido!' :
                       'Medicamento Vencendo em Breve!'}
                    </Text>
                    <Text $size="sm" $color="#6B7280">
                      {metrics.status === 'critical' 
                        ? 'O estoque está zerado. Reposição urgente necessária.'
                        : metrics.status === 'expired'
                        ? 'Este medicamento está vencido e não pode ser utilizado.'
                        : 'Este medicamento vencerá em menos de 30 dias.'}
                    </Text>
                  </div>
                </Flex>
              </CardContent>
            </Card>
          )}

          <Spacer $size="lg" />

          {/* Gráfico de Histórico */}
          {chartData.length > 0 && (
            <ChartContainer>
              <ChartTitle>Histórico de Movimentações (Últimos 7 dias)</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="entrada" stackId="1" stroke="#2E7D32" fill="#2E7D32" />
                  <Area type="monotone" dataKey="saida" stackId="2" stroke="#D32F2F" fill="#D32F2F" />
                  <Line type="monotone" dataKey="saldo" stroke="#1976D2" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          <Spacer $size="lg" />

          {/* Formulário de Movimentação */}
          <ResponsiveGrid $columns={1}>
            <Card>
              <CardHeader>
                <CardTitle>Nova Movimentação</CardTitle>
              </CardHeader>
              <CardContent>
                <MovementForm
                  medicineId={Number(medicineId)}
                  onUpdated={handleUpdated}
                />
                <Spacer $size="md" />
                <Flex $justify="center">
                  <ActionButton onClick={() => navigate(`/stock/movements/${medicineId}`)}>
                    <FaChartLine />
                    Ver Histórico Completo
                  </ActionButton>
                </Flex>
              </CardContent>
            </Card>
          </ResponsiveGrid>
        </>
      ) : null}
    </PageContainer>
  );
}
