import { memo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../hooks/useAuth';

const Card = styled.div`
  display: block;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md};
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: default;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary + '30'};
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled(Link)`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.black};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  line-height: 1.3;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.4;
`;

const HeartBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 1.1rem;
  transition: transform 0.15s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.15);
  }
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.span<{ $color?: string; $bg?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color || '#616161'};
  background: ${({ $bg }) => $bg || '#f3f4f6'};
`;

const StockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

const StockInfo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const StockNumber = styled.span<{ $low: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${({ $low, theme }) => ($low ? theme.colors.danger : theme.colors.success)};
`;

const StockLabel = styled.span`
  font-size: 12px;
  color: #9e9e9e;
`;

const DetailLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const CATEGORY_COLORS: Record<string, { color: string; bg: string }> = {
  analgesico: { color: '#d97706', bg: '#fffbeb' },
  antibiotico: { color: '#dc2626', bg: '#fef2f2' },
  antiviral: { color: '#7c3aed', bg: '#f3e8ff' },
  antiinflamatorio: { color: '#2563eb', bg: '#eff6ff' },
  vitaminas: { color: '#059669', bg: '#ecfdf5' },
  outros: { color: '#6b7280', bg: '#f3f4f6' },
};

function MedicineCardBase({ medicine }: { medicine: Medicine }) {
  const { user } = useAuth();
  const isPatient = user?.role === 'user';
  const inStock = medicine.quantidade > 0;
  const lowStock = medicine.quantidade <= (medicine.quantidade_minima || 0);
  const [isFav, setIsFav] = useState(medicine.is_favorite || false);
  const [busy, setBusy] = useState(false);

  const toggleFav = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (busy) return;
      try {
        setBusy(true);
        if (isFav) {
          await favoriteService.remove(medicine.id);
          toast.success('Removido dos favoritos');
        } else {
          await favoriteService.add(medicine.id);
          toast.success('Adicionado aos favoritos');
        }
        setIsFav((v: boolean) => !v);
      } catch {
        toast.error('Falha ao atualizar favorito');
      } finally {
        setBusy(false);
      }
    },
    [isFav, busy, medicine.id]
  );

  const catStyle = CATEGORY_COLORS[medicine.categoria || 'outros'] || CATEGORY_COLORS.outros;

  return (
    <Card>
      <TopRow>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Title to={`/medicines/${medicine.id}`}>{medicine.nome}</Title>
          <Meta>
            {medicine.principio_ativo || '-'}
            {medicine.concentracao ? ` · ${medicine.concentracao}` : ''}
          </Meta>
        </div>
        {isPatient ? (
          <HeartBtn onClick={toggleFav} aria-label={isFav ? 'Remover favorito' : 'Favoritar'}>
            {isFav ? <FaHeart /> : <FaRegHeart />}
          </HeartBtn>
        ) : null}
      </TopRow>

      <BadgeRow>
        <Badge $color={catStyle.color} $bg={catStyle.bg}>
          {medicine.categoria || 'Sem categoria'}
        </Badge>
        {medicine.forma_farmaceutica ? (
          <Badge>💊 {medicine.forma_farmaceutica}</Badge>
        ) : null}
      </BadgeRow>

      <StockRow>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: lowStock ? '#dc2626' : inStock ? '#059669' : '#9e9e9e' }}>
          <span style={{ fontSize: 16 }}>
            {lowStock ? '⚠️' : inStock ? '📦' : '❌'}
          </span>
          {lowStock ? 'Estoque baixo' : inStock ? 'Disponível' : 'Esgotado'}
        </span>
        <DetailLink to={`/medicines/${medicine.id}`}>Ver detalhes →</DetailLink>
      </StockRow>
    </Card>
  );
}

export default memo(MedicineCardBase);
