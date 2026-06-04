import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Medicine } from '../../types/medicine.types';
import { ChartContainer, ChartTitle, ResponsiveGrid } from '../../styles/components/Stock/styles';

interface DashboardChartsProps {
  medicines: Medicine[];
  loading?: boolean;
}

export default function DashboardCharts({ medicines, loading = false }: DashboardChartsProps) {
  // Dados para gráfico de pizza - Status do Estoque
  const stockStatusData = useMemo(() => {
    const statusData = [
      { name: 'Normal', value: 0, color: '#2E7D32' },
      { name: 'Baixo', value: 0, color: '#F57C00' },
      { name: 'Crítico', value: 0, color: '#D32F2F' },
      { name: 'Vencendo', value: 0, color: '#E65100' },
      { name: 'Vencido', value: 0, color: '#616161' },
    ];

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    medicines.forEach(medicine => {
      const quantity = medicine.quantidade ?? 0;
      const minimum = medicine.quantidade_minima ?? 0;
      const expiry = medicine.validade ? new Date(medicine.validade) : null;

      if (expiry && expiry < now) {
        statusData[4].value++;
      } else if (quantity === 0) {
        statusData[2].value++;
      } else if (quantity <= minimum) {
        statusData[1].value++;
      } else if (expiry && expiry <= thirtyDaysFromNow) {
        statusData[3].value++;
      } else {
        statusData[0].value++;
      }
    });

    return statusData.filter(item => item.value > 0);
  }, [medicines]);

  // Dados para gráfico de barras - Top 10 medicamentos por quantidade
  const topMedicinesData = useMemo(() => {
    return medicines
      .map(medicine => ({
        name: medicine.nome.length > 20 ? medicine.nome.substring(0, 20) + '...' : medicine.nome,
        quantity: medicine.quantidade || 0,
        minimum: medicine.quantidade_minima || 0,
        status: (medicine.quantidade || 0) <= (medicine.quantidade_minima || 0) ? 'Baixo' : 'Normal'
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [medicines]);

  // Dados para gráfico de validades - Próximos 60 dias
  const expiryTimelineData = useMemo(() => {
    const timelineData = [];
    const now = new Date();
    
    for (let i = 0; i < 60; i += 5) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
      
      let expiringCount = 0;
      medicines.forEach(medicine => {
        if (medicine.validade) {
          const expiry = new Date(medicine.validade);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (daysUntilExpiry >= 0 && daysUntilExpiry <= 5) {
            expiringCount++;
          }
        }
      });
      
      timelineData.push({
        date: dateString,
        expiring: expiringCount,
      });
    }
    
    return timelineData;
  }, [medicines]);

  // Dados para gráfico de localização
  const locationData = useMemo(() => {
    const locationMap = new Map<string, number>();
    
    medicines.forEach(medicine => {
      const location = medicine.localizacao_prateleira || 'Não definida';
      locationMap.set(location, (locationMap.get(location) || 0) + (medicine.quantidade || 0));
    });

    return Array.from(locationMap.entries())
      .map(([location, quantity]) => ({ location, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [medicines]);

  if (loading) {
    return (
      <ResponsiveGrid $columns={2}>
        <ChartContainer>
          <ChartTitle>Carregando gráficos...</ChartTitle>
          <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#9CA3AF' }}>Processando dados...</span>
          </div>
        </ChartContainer>
        <ChartContainer>
          <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#9CA3AF' }}>Processando dados...</span>
          </div>
        </ChartContainer>
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid $columns={2}>
      {/* Gráfico de Pizza - Status do Estoque */}
      <ChartContainer>
        <ChartTitle>Status do Estoque</ChartTitle>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stockStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {stockStatusData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Gráfico de Barras - Top Medicamentos */}
      <ChartContainer>
        <ChartTitle>Top 10 Medicamentos (Estoque)</ChartTitle>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topMedicinesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="quantity" 
              fill="#2E7D32"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Gráfico de Linha - Timeline de Vencimentos */}
      <ChartContainer>
        <ChartTitle>Previsão de Vencimentos (Próximos 60 dias)</ChartTitle>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={expiryTimelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="expiring" 
              stroke="#E65100" 
              strokeWidth={2}
              dot={{ fill: '#E65100', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Gráfico de Barras - Itens por Localização */}
      <ChartContainer>
        <ChartTitle>Itens por Localização</ChartTitle>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={locationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="location" type="category" width={80} fontSize={12} />
            <Tooltip />
            <Bar 
              dataKey="quantity" 
              fill="#1976D2"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ResponsiveGrid>
  );
}
