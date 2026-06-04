import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaFilter, FaDownload, FaSearch } from 'react-icons/fa';

import { medicineService, type StockMovement } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  TableContainer,
  TableHeader,
  TableTitle,
  TableActions,
  SearchContainer,
  SearchInput,
  SearchIcon,
  FilterButton,
  ExportButton,
  StyledTable,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  StatusBadge,
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  LoadingContainer,
  LoadingSpinner,
  Flex,
  Text,
  Spacer,
} from '../../styles/components/Stock/styles';

export default function StockMovementsPage() {
  const { medicineId } = useParams();
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [items, setItems] = useState<StockMovement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida' | 'ajuste'>('all');

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!medicineId) return;
        setLoading(true);
        const data = await medicineService.movements(medicineId, { page, limit });
        if (mounted) {
          setItems(data.items);
          setTotal(data.total);
        }
      } catch {
        toast.error('Falha ao carregar movimentações');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [medicineId, page, limit]);

  // Filtrar movimentações
  const filteredItems = useMemo(() => {
    let filtered = items;
    
    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.tipo === filterType);
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.observacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [items, filterType, searchTerm]);

  if (!isStaff) {
    return (
      <PageContainer>
        <PageHeader>
          <div>
            <PageTitle>Histórico de movimentações</PageTitle>
            <Text $color="#6B7280">Acesso restrito.</Text>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  
  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'entrada': return '#2E7D32';
      case 'saida': return '#D32F2F';
      case 'ajuste': return '#1976D2';
      default: return '#6B7280';
    }
  };

  const exportPDF = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Histórico de Movimentações</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
  h1 { font-size: 24px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
  th { background: #f5f5f5; font-weight: 600; }
  .badge { padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }
  .entrada { background: #e8f5e8; color: #2e7d32; }
  .saida { background: #ffebee; color: #d32f2f; }
  .ajuste { background: #e3f2fd; color: #1976d2; }
</style>
</head>
<body>
  <h1>Histórico de Movimentações</h1>
  <p>Gerado em: ${new Date().toLocaleString()}</p>
  <table>
    <thead>
      <tr>
        <th>Data</th><th>Tipo</th><th>Qtd</th><th>Motivo</th><th>Usuário</th><th>Obs.</th>
      </tr>
    </thead>
    <tbody>
      ${filteredItems.map((m) => `
        <tr>
          <td>${new Date(m.created_at).toLocaleString()}</td>
          <td><span class="badge ${m.tipo}">${m.tipo}</span></td>
          <td style="text-align: right">${m.quantidade}</td>
          <td>${m.motivo || '-'}</td>
          <td>${m.user?.nome || '-'}</td>
          <td>${m.observacao || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;
    const w = window.open('', '_blank');
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 500);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <Flex $align="center" $gap="16px">
          <ActionButton onClick={() => window.location.href = `/stock/manage/${medicineId}`}>
            <FaArrowLeft />
            Voltar
          </ActionButton>
          <div>
            <PageTitle>Histórico de Movimentações</PageTitle>
            <Text $color="#6B7280">
              Todas as movimentações do medicamento
            </Text>
          </div>
        </Flex>
      </PageHeader>

      <TableContainer>
        <TableHeader>
          <TableTitle>Histórico Completo</TableTitle>
          <TableActions>
            <SearchContainer>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Buscar movimentação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>
            <FilterButton onClick={() => {
              const types: Array<'all' | 'entrada' | 'saida' | 'ajuste'> = ['all', 'entrada', 'saida', 'ajuste'];
              const currentIndex = types.indexOf(filterType);
              const nextIndex = (currentIndex + 1) % types.length;
              setFilterType(types[nextIndex]);
            }}>
              <FaFilter />
              {filterType === 'all' ? 'Todos' : 
               filterType === 'entrada' ? 'Entradas' :
               filterType === 'saida' ? 'Saídas' : 'Ajustes'}
            </FilterButton>
            <ExportButton onClick={exportPDF}>
              <FaDownload />
              Exportar PDF
            </ExportButton>
          </TableActions>
        </TableHeader>

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <span>Carregando...</span>
          </LoadingContainer>
        ) : filteredItems.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FaSearch />
            </EmptyStateIcon>
            <EmptyStateTitle>
              {searchTerm || filterType !== 'all' ? 'Nenhuma movimentação encontrada' : 'Nenhuma movimentação registrada'}
            </EmptyStateTitle>
            <EmptyStateText>
              {searchTerm || filterType !== 'all' 
                ? 'Tente ajustar sua busca ou filtros'
                : 'As movimentações aparecerão aqui quando forem registradas'}
            </EmptyStateText>
          </EmptyState>
        ) : (
          <>
            <StyledTable>
              <Table>
                <TableHead>
                  <tr>
                    <TableHeaderCell>Data</TableHeaderCell>
                    <TableHeaderCell>Tipo</TableHeaderCell>
                    <TableHeaderCell style={{ textAlign: 'right' }}>Quantidade</TableHeaderCell>
                    <TableHeaderCell>Motivo</TableHeaderCell>
                    <TableHeaderCell>Usuário</TableHeaderCell>
                    <TableHeaderCell>Observações</TableHeaderCell>
                  </tr>
                </TableHead>
                <tbody>
                  {filteredItems.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {new Date(m.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {new Date(m.created_at).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          $status={m.tipo === 'entrada' ? 'normal' : 
                                  m.tipo === 'saida' ? 'critical' : 'normal'}
                        >
                          {m.tipo === 'entrada' ? 'ENTRADA' :
                           m.tipo === 'saida' ? 'SAÍDA' : 'AJUSTE'}
                        </StatusBadge>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right', fontWeight: 600 }}>
                        {m.tipo === 'saida' ? '-' : '+'}{m.quantidade}
                      </TableCell>
                      <TableCell>
                        <Text $size="sm">
                          {m.motivo || '-'}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text $size="sm">
                          {m.user?.nome || '-'}
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Text $size="sm" $color="#6B7280">
                          {m.observacao || '-'}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </StyledTable>

            {/* Paginação */}
            <Flex $justify="center" $align="center" $gap="12px" style={{ marginTop: '16px' }}>
              <ActionButton 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page <= 1}
              >
                Anterior
              </ActionButton>
              <Text $size="sm">
                Página {page} de {totalPages} • {filteredItems.length} de {total} resultados
              </Text>
              <ActionButton 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </ActionButton>
            </Flex>
          </>
        )}
      </TableContainer>
    </PageContainer>
  );
}
