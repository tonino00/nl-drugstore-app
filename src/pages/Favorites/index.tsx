import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchFavoritesThunk } from '../../store/slices/favoriteSlice';
import MedicineCard from '../../components/Medicine/MedicineCard';

export default function FavoritesPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.favorites);

  useEffect(() => {
    dispatch(fetchFavoritesThunk());
  }, [dispatch]);

  return (
    <div>
      <h2>Meus favoritos</h2>
      {loading ? <div>Carregando...</div> : null}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {items.map((m) => (
          <MedicineCard key={m.id} medicine={m} />
        ))}
      </div>
    </div>
  );
}
