import { useMemo, useState } from 'react';
import { FaSearch, FaFilter, FaDownload, FaEdit, FaHistory, FaBox } from 'react-icons/fa';
import type { Medicine } from '../../types/medicine.types';
import {
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
  StockProgressContainer,
  StockProgressBar,
  StockText,
  ActionButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
  LoadingContainer,
  LoadingSpinner,
} from '../../styles/components/Stock/styles';

interface StockTableProps {
  medicines: Medicine[];
  loading?: boolean;
  onEdit?: (medicine: Medicine) => void;
  onHistory?: (medicine: Medicine) => void;
  onManage?: (medicine: Medicine) => void;
  onExport?: () => void;
}

type SortField = 'nome' | 'quantidade' | 'validade' | 'localizacao_prateleira';
type SortDirection = 'asc' | 'desc';

export default function StockTable({
  medicines,
  loading = false,
  onEdit,
  onHistory,
  onManage,
  onExport,
}: StockTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

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

  // Função para obter a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#B71C1C';
      case 'low': return '#F57C00';
      case 'normal': return '#2E7D32';
      case 'expired': return '#616161';
      case 'expiring': return '#E65100';
      default: return '#9E9E9E';
    }
  };

  // Função para calcular a porcentagem do estoque
  const getStockPercentage = (medicine: Medicine) => {
    const quantity = medicine.quantidade ?? 0;
    const minimum = medicine.quantidade_minima ?? 0;
    if (minimum === 0) return 100;
    return Math.min((quantity / minimum) * 100, 100);
  };

  // Filtrar e ordenar medicamentos
  const filteredAndSortedMedicines = useMemo(() => {
    let filtered = medicines.filter(medicine =>
      medicine.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.principio_ativo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.localizacao_prateleira?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'quantidade':
          aValue = a.quantidade ?? 0;
          bValue = b.quantidade ?? 0;
          break;
        case 'validade':
          aValue = a.validade ? new Date(a.validade).getTime() : Infinity;
          bValue = b.validade ? new Date(b.validade).getTime() : Infinity;
          break;
        case 'localizacao_prateleira':
          aValue = a.localizacao_prateleira || '';
          bValue = b.localizacao_prateleira || '';
          break;
        default:
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [medicines, searchTerm, sortField, sortDirection]);

  // Função para lidar com a ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Renderizar o conteúdo da tabela
  const renderTableContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
          <span>Carregando...</span>
        </LoadingContainer>
      );
    }

    if (filteredAndSortedMedicines.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <FaBox />
          </EmptyStateIcon>
          <EmptyStateTitle>
            {searchTerm ? 'Nenhum medicamento encontrado' : 'Nenhum medicamento no estoque'}
          </EmptyStateTitle>
          <EmptyStateText>
            {searchTerm 
              ? 'Tente ajustar sua busca ou filtros'
              : 'Adicione medicamentos ao estoque para começar'
            }
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <StyledTable>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>
                <button
                  onClick={() => handleSort('nome')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Medicamento
                  {sortField === 'nome' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleSort('quantidade')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'center',
                  }}
                >
                  Estoque
                  {sortField === 'quantidade' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'center' }}>Status</TableHeaderCell>
              <TableHeaderCell>
                <button
                  onClick={() => handleSort('validade')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Validade
                  {sortField === 'validade' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </TableHeaderCell>
              <TableHeaderCell>
                <button
                  onClick={() => handleSort('localizacao_prateleira')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    font: 'inherit',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Localização
                  {sortField === 'localizacao_prateleira' && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'center' }}>Ações</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody>
            {filteredAndSortedMedicines.map((medicine) => {
              const status = getStockStatus(medicine);
              const percentage = getStockPercentage(medicine);
              
              return (
                <TableRow key={medicine.id}>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {medicine.nome}
                      </div>
                      {medicine.principio_ativo && (
                        <div style={{ fontSize: '12px', color: '#6B7280' }}>
                          {medicine.principio_ativo}
                          {medicine.concentracao && ` • ${medicine.concentracao}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <StockProgressContainer>
                      <StockProgressBar 
                        $percentage={percentage} 
                        $status={status === 'critical' || status === 'expired' ? 'critical' : 
                                status === 'low' || status === 'expiring' ? 'low' : 'normal'}
                      />
                      <StockText>{medicine.quantidade ?? 0}</StockText>
                    </StockProgressContainer>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <StatusBadge $status={status}>
                      {status === 'critical' ? 'CRÍTICO' :
                       status === 'low' ? 'BAIXO' :
                       status === 'normal' ? 'NORMAL' :
                       status === 'expired' ? 'VENCIDO' : 'VENCENDO'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {medicine.validade ? (
                      <div>
                        <div>{new Date(medicine.validade).toLocaleDateString('pt-BR')}</div>
                        {status === 'expiring' && (
                          <div style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>
                            Vence em {Math.ceil((new Date(medicine.validade).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {medicine.localizacao_prateleira || (
                      <span style={{ color: '#9CA3AF' }}>Não definida</span>
                    )}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {onManage && (
                        <ActionButton onClick={() => onManage(medicine)}>
                          <FaEdit />
                          Gerenciar
                        </ActionButton>
                      )}
                      {onHistory && (
                        <ActionButton onClick={() => onHistory(medicine)}>
                          <FaHistory />
                          Histórico
                        </ActionButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </StyledTable>
    );
  };

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Estoque de Medicamentos</TableTitle>
        <TableActions>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Buscar medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <FilterButton onClick={() => setShowFilters(!showFilters)}>
            <FaFilter />
            Filtros
          </FilterButton>
          {onExport && (
            <ExportButton onClick={onExport}>
              <FaDownload />
              Exportar
            </ExportButton>
          )}
        </TableActions>
      </TableHeader>
      
      {renderTableContent()}
    </TableContainer>
  );
}
