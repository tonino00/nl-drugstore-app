import { useEffect, useMemo, useState } from 'react';
import { FaBoxes, FaCapsules, FaSearch } from 'react-icons/fa';

import { useDebounce } from '../../hooks/useDebounce';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchMedicinesThunk } from '../../store/slices/medicineSlice';
import { medicineService } from '../../services/medicineService';
import MedicineCard from '../../components/Medicine/MedicineCard';
import SkeletonCard from '../../components/Medicine/SkeletonCard';

import {
  EmptyActions,
  EmptyIcon,
  EmptyState,
  EmptyText,
  EmptyTitle,
  Field,
  FieldLabel,
  Grid,
  HeaderActions,
  Input,
  LimitControl,
  LimitLabel,
  LimitSelect,
  Page,
  PageHeader,
  PageSubtitle,
  PageTitle,
  Pagination,
  PaginationButton,
  PaginationStatus,
  PrimaryAction,
  ResultCount,
  SecondaryAction,
  Select,
  TitleGroup,
  Toolbar,
} from '../../styles/pages/Medicines/ListMedicines/styles';

const DEFAULT_CATEGORIES = ['analgesico', 'antibiotico', 'antiviral', 'antiinflamatorio', 'vitaminas', 'outros'];
const MAX_SKELETON_CARDS = 9;

export default function ListMedicinesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { items, loading, total, page, pageSize } = useAppSelector((s) => s.medicines);

  const canManage = user?.role === 'pharmacist' || user?.role === 'admin';

  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(20);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

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

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await medicineService.categories();
        if (mounted) setCategories(data.length > 0 ? data : DEFAULT_CATEGORIES);
      } catch {
        if (mounted) setCategories(DEFAULT_CATEGORIES);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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

  const hasActiveFilters = Boolean(debouncedQ || category);
  const hasRegisteredItems = total > 0;
  const hasOnlyHiddenItems = !canManage && items.length > 0 && visibleItems.length === 0;
  const showEmptyState = visibleItems.length === 0;
  const skeletonCount = Math.min(limit, MAX_SKELETON_CARDS);

  const totalPages = Math.ceil(total / limit) || 1;
  const visibleTotalLabel = canManage
    ? `${total} ${total === 1 ? 'medicamento cadastrado' : 'medicamentos cadastrados'}`
    : `${visibleItems.length} ${visibleItems.length === 1 ? 'medicamento disponível nesta página' : 'medicamentos disponíveis nesta página'}`;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    dispatch(fetchMedicinesThunk({ ...query, page: p }));
  };

  const clearFilters = () => {
    setQ('');
    setCategory('');
  };

  const emptyState = (() => {
    if (hasActiveFilters) {
      return {
        icon: <FaSearch aria-hidden="true" />,
        tone: 'info' as const,
        title: 'Nenhum medicamento encontrado',
        text: 'A busca ou categoria atual não retornou itens. Revise o nome, princípio ativo ou limpe os filtros para voltar à lista completa.',
        action: <SecondaryAction type="button" onClick={clearFilters}>Limpar filtros</SecondaryAction>,
      };
    }

    if (hasOnlyHiddenItems) {
      return {
        icon: <FaBoxes aria-hidden="true" />,
        tone: 'warning' as const,
        title: 'Sem estoque disponível para consulta',
        text: 'Há medicamentos cadastrados, mas nenhum está disponível para moradores nesta página. Itens esgotados ou vencidos ficam ocultos até reposição ou revisão da validade.',
        action: null,
      };
    }

    if (!hasRegisteredItems) {
      return {
        icon: <FaCapsules aria-hidden="true" />,
        tone: 'success' as const,
        title: canManage ? 'Cadastre o primeiro medicamento' : 'A lista de medicamentos ainda está vazia',
        text: canManage
          ? 'Medicamentos cadastrados aparecem aqui com categoria, estoque e detalhes para consulta rápida da equipe.'
          : 'Quando a farmácia cadastrar medicamentos disponíveis, eles aparecerão aqui para consulta e favoritos.',
        action: canManage ? <PrimaryAction to="/medicines/new">Cadastrar medicamento</PrimaryAction> : null,
      };
    }

    return {
      icon: <FaBoxes aria-hidden="true" />,
      tone: 'warning' as const,
      title: 'Nenhum medicamento visível',
      text: 'Não há medicamentos disponíveis com os critérios atuais. Tente atualizar a lista ou revisar os filtros aplicados.',
      action: hasActiveFilters ? <SecondaryAction type="button" onClick={clearFilters}>Limpar filtros</SecondaryAction> : null,
    };
  })();

  return (
    <Page>
      <PageHeader>
        <TitleGroup>
          <PageTitle>Medicamentos</PageTitle>
          <PageSubtitle>
            Consulte disponibilidade, categoria e detalhes dos medicamentos cadastrados na farmácia.
          </PageSubtitle>
        </TitleGroup>
        {canManage ? (
          <HeaderActions>
            <PrimaryAction to="/medicines/new">Cadastrar medicamento</PrimaryAction>
          </HeaderActions>
        ) : null}
      </PageHeader>

      <Toolbar>
        <Field>
          <FieldLabel>Buscar medicamento</FieldLabel>
          <Input
            id="medicine-search"
            placeholder="Buscar por nome ou princípio ativo"
            value={q}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Select
            id="medicine-category"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </Toolbar>

      {loading ? (
        <Grid>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Grid>
      ) : (
        <>
          {showEmptyState ? (
            <EmptyState aria-live="polite">
              <EmptyIcon $tone={emptyState.tone}>{emptyState.icon}</EmptyIcon>
              <EmptyTitle>{emptyState.title}</EmptyTitle>
              <EmptyText>{emptyState.text}</EmptyText>
              {emptyState.action ? <EmptyActions>{emptyState.action}</EmptyActions> : null}
            </EmptyState>
          ) : (
            <Grid>
              {visibleItems.map((m) => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </Grid>
          )}

          <ResultCount aria-live="polite">
            {visibleTotalLabel}
          </ResultCount>

          {!showEmptyState && totalPages > 1 ? (
            <Pagination aria-label="Paginação de medicamentos">
              <PaginationButton type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1} aria-label="Ir para a página anterior">
                ← Anterior
              </PaginationButton>
              <PaginationStatus aria-current="page">
                Página {page} de {totalPages}
              </PaginationStatus>
              <PaginationButton type="button" onClick={() => goToPage(page + 1)} disabled={page >= totalPages} aria-label="Ir para a próxima página">
                Próxima →
              </PaginationButton>
            </Pagination>
          ) : null}

          {!showEmptyState ? (
            <LimitControl>
              <LimitLabel>
                Itens por página:
                <LimitSelect
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </LimitSelect>
              </LimitLabel>
            </LimitControl>
          ) : null}
        </>
      )}
    </Page>
  );
}
