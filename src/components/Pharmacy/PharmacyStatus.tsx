import { useEffect } from 'react';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNextOpeningThunk, fetchPharmacyHoursThunk, fetchPharmacyStatusThunk } from '../../store/slices/pharmacySlice';

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
  const hours = useAppSelector((s) => s.pharmacy.hours);

  useEffect(() => {
    if (!status) dispatch(fetchPharmacyStatusThunk());
    if (!next) dispatch(fetchNextOpeningThunk());
    if (!hours) dispatch(fetchPharmacyHoursThunk());
  }, [status, next, hours, dispatch]);

  const open = status?.open;
  const dayIndex = next?.day_of_week;
  const dayName = dayIndex != null ? DAYS[dayIndex] : null;

  const nextDayHours =
    dayIndex != null && hours
      ? hours.find((d) => d.day_of_week === dayIndex && d.is_open)
      : undefined;

  const rawOpenTime = nextDayHours?.opening_time ?? next?.opening_time;
  const rawCloseTime = nextDayHours?.closing_time;

  const formatTime = (value?: string | null) => {
    if (!value) return null;
    const [h, m] = value.split(':');
    if (!h || !m) return value;
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  };

  const openLabel = formatTime(rawOpenTime);
  const closeLabel = formatTime(rawCloseTime);

  const shortDay = dayName === 'Segunda-feira'
    ? 'segunda'
    : dayName === 'Terça-feira'
    ? 'terça'
    : dayName === 'Quarta-feira'
    ? 'quarta'
    : dayName === 'Quinta-feira'
    ? 'quinta'
    : dayName === 'Sexta-feira'
    ? 'sexta'
    : dayName === 'Sábado'
    ? 'sábado'
    : 'domingo';

  const todayIndex = new Date().getDay();
  const isToday = dayIndex != null && dayIndex === todayIndex;

  return (
    <Wrapper $compact={compact} $open={open}>
      <StatusBadge $open={open}>
        {open ? '🟢 ABERTO' : '🔴 FECHADO'}
      </StatusBadge>
      {!open && dayName && openLabel ? (
        <NextLabel>
          {isToday
            ? `Hoje — ${openLabel}${closeLabel ? ` às ${closeLabel}` : ''}`
            : `Abre ${shortDay} ${
                closeLabel ? `— ${openLabel} às ${closeLabel}` : `às ${openLabel}`
              }`}
        </NextLabel>
      ) : null}
    </Wrapper>
  );
}
