import { useEffect } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNextOpeningThunk, fetchPharmacyStatusThunk } from '../../store/slices/pharmacySlice';

const DAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const Wrapper = styled.div<{ $compact?: boolean; $open?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $compact }) => ($compact ? 'flex-start' : 'space-between')};
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ $compact, theme }) => ($compact ? 0 : theme.spacing.sm)};
`;

const StatusBadge = styled.span<{ $open?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $open }) => ($open ? '#ecfdf5' : '#fef2f2')};
  color: ${({ $open }) => ($open ? '#059669' : '#dc2626')};
  border: 1px solid ${({ $open }) => ($open ? '#a7f3d0' : '#fecaca')};
`;

const NextLabel = styled.span`
  font-size: 12px;
  color: #9e9e9e;
`;

export default function PharmacyStatus({ compact }: { compact?: boolean }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.pharmacy.status);
  const next = useAppSelector((s) => s.pharmacy.nextOpening);

  useEffect(() => {
    if (!status) dispatch(fetchPharmacyStatusThunk());
    if (!next) dispatch(fetchNextOpeningThunk());
  }, [status, next, dispatch]);

  const open = status?.open;
  const dayName = next?.day_of_week != null ? DAYS[next.day_of_week] : null;
  const time = next?.opening_time;

  return (
    <Wrapper $compact={compact} $open={open}>
      <StatusBadge $open={open}>
        {open ? '🟢 ABERTO' : '🔴 FECHADO'}
      </StatusBadge>
      {!open && dayName && time ? (
        <NextLabel>
          Abre {dayName === 'Segunda-feira' ? 'segunda' : dayName === 'Terça-feira' ? 'terça' : dayName === 'Quarta-feira' ? 'quarta' : dayName === 'Quinta-feira' ? 'quinta' : dayName === 'Sexta-feira' ? 'sexta' : dayName === 'Sábado' ? 'sábado' : 'domingo'} às {time}
        </NextLabel>
      ) : null}
    </Wrapper>
  );
}
