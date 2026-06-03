import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMedicinesThunk } from '../../store/slices/medicineSlice';
import MedicineCard from '../../components/Medicine/MedicineCard';
import SkeletonCard from '../../components/Medicine/SkeletonCard';

import { Grid, Input, Select, Toolbar } from '../../styles/pages/Medicines/ListMedicines/styles';

export default function ListMedicinesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items, loading, total, page, pageSize } = useAppSelector((s) => s.medicines);

  const canManage = user?.role === 'pharmacist' || user?.role === 'admin';

  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(20);

  const debouncedQ = useDebounce(q, 300);

  const query = useMemo(() => {
    return {
      q: debouncedQ || undefined,
      categoria: category || undefined,
      page: 1,
      limit,
    };
  }, [debouncedQ, category, limit]);

  useEffect(() => {
    dispatch(fetchMedicinesThunk(query));
  }, [dispatch, query]);

  const visibleItems = useMemo(() => {
    if (canManage) return items;
    const now = new Date();
    return items.filter((m) => {
      const inStock = (m.quantidade ?? 0) > 0;
      if (!inStock) return false;
      if (!m.validade) return true;
      const expiry = new Date(m.validade);
      return expiry >= now;
    });
  }, [items, canManage]);

  const totalPages = Math.ceil(total / limit) || 1;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    dispatch(fetchMedicinesThunk({ ...query, page: p }));
  };

  return (
    <div>
      <h2>Medicamentos</h2>
      {canManage ? (
        <div style={{ marginBottom: 12 }}>
          <Link to="/medicines/new">Cadastrar medicamento</Link>
        </div>
      ) : null}
      <Toolbar>
        <Input
          placeholder="Buscar por nome ou princípio ativo"
          value={q}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />

        <Select
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
        >
          <option value="">Todas categorias</option>
          <option value="Analgésico">Analgésico</option>
          <option value="Antibiótico">Antibiótico</option>
        </Select>
      </Toolbar>

      {loading ? (
        <Grid>
          {Array.from({ length: limit }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Grid>
      ) : (
        <>
          <Grid>
            {visibleItems.map((m) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </Grid>

          {totalPages > 1 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                ← Anterior
              </button>
              <span style={{ fontSize: 14, color: '#616161' }}>
                Página {page} de {totalPages} ({total} total)
              </span>
              <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
                Próxima →
              </button>
            </div>
          ) : null}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 12,
            }}
          >
            <label
              style={{
                fontSize: 14,
                color: '#616161',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              Itens por página:
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 14,
                  minWidth: 72,
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
