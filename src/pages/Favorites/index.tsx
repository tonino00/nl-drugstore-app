import { useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFavoritesThunk } from '../../store/slices/favoriteSlice';
import MedicineCard from '../../components/Medicine/MedicineCard';

const Page = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.black};
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.grayDark};

  svg {
    color: ${({ theme }) => theme.colors.grayLight};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavoritesThunk());
  }, [dispatch]);

  return (
    <Page>
      <Header>
        <FaHeart size={22} color="#D32F2F" />
        <h2>Meus favoritos</h2>
      </Header>

      {loading ? <p>Carregando...</p> : null}

      {!loading && items.length === 0 ? (
        <Empty>
          <FaHeart size={48} />
          <p>Você ainda não tem medicamentos favoritos.</p>
        </Empty>
      ) : null}

      {items.length > 0 ? (
        <Grid>
          {items.map((m) => (
            <MedicineCard key={m.id} medicine={m} hideFavorite />
          ))}
        </Grid>
      ) : null}
    </Page>
  );
}
