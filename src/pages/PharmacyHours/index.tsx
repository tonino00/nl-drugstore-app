import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPharmacyHoursThunk } from '../../store/slices/pharmacySlice';
import { pharmacyService, type PharmacyDayHours } from '../../services/pharmacyService';
import { useAuth } from '../../hooks/useAuth';
import {
  PageWrap,
  PageTitle,
  Card,
  SectionTitle,
  StatusCard,
  StatusEmoji,
  StatusLabel,
  StatusHint,
  TableScroll,
  Table,
  Th,
  Td,
  Badge,
  ButtonRow,
  PrimaryBtn,
  SecondaryBtn,
  SmallBtn,
  SectionHeader,
  ModalOverlay,
  ModalBox,
  ModalHeader,
  ModalTitle,
  CloseBtn,
  Field,
  FieldLabel,
  TextInput,
  TimeRow,
  TimeInput,
  RadioGroup,
  RadioLabel,
  Muted,
} from '../../styles/components/PharmacyHours/styles';

const DAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

interface Holiday {
  id: number;
  date: string;
  name: string;
  is_open: boolean;
  opening_time?: string | null;
  closing_time?: string | null;
}

export default function PharmacyHoursPage() {
  const dispatch = useAppDispatch();
  const hours = useAppSelector((s) => s.pharmacy.hours);
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [form, setForm] = useState<PharmacyDayHours[]>([]);
  const [saving, setSaving] = useState(false);

  const [currentOpen, setCurrentOpen] = useState<boolean | null>(null);
  const [nextClose, setNextClose] = useState('');
  const [nextOpen, setNextOpen] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editDay, setEditDay] = useState<PharmacyDayHours | null>(null);
  const [editLunchStart, setEditLunchStart] = useState('');
  const [editLunchEnd, setEditLunchEnd] = useState('');

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 1, date: '2025-12-25', name: 'Natal', is_open: false },
    { id: 2, date: '2026-01-01', name: 'Ano Novo', is_open: false },
  ]);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [holidayForm, setHolidayForm] = useState<Partial<Holiday>>({ is_open: false });

  useEffect(() => {
    dispatch(fetchPharmacyHoursThunk());
  }, [dispatch]);

  useEffect(() => {
    if (hours && Array.isArray(hours) && hours.length > 0) {
      setForm(
        hours.map((h: any) => ({
          day_of_week: h.day_of_week,
          opening_time: h.opening_time || '08:00',
          closing_time: h.closing_time || '18:00',
          is_open: Boolean(h.is_open),
        }))
      );
    } else {
      // Inicializar com dias padrão se backend não retornar nada
      setForm(
        [0, 1, 2, 3, 4, 5, 6].map((day) => ({
          day_of_week: day,
          opening_time: day === 0 ? null : '08:00',
          closing_time: day === 0 ? null : '18:00',
          is_open: day !== 0,
        }))
      );
    }
  }, [hours]);

  const formatTime = (value?: string | null) => {
    if (!value) return '';
    const [h, m] = value.split(':');
    if (!h || !m) return value;
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  };

  // Calcular status atual baseado nos horários locais (form)
  useEffect(() => {
    if (form.length === 0) return;
    const now = new Date();
    const todayIdx = now.getDay();
    const todayMinutes = now.getHours() * 60 + now.getMinutes();

    const today = form.find((d) => d.day_of_week === todayIdx);
    if (!today || !today.is_open || !today.opening_time || !today.closing_time) {
      setCurrentOpen(false);
      // Próxima abertura: buscar próximo dia aberto
      for (let offset = 1; offset <= 7; offset++) {
        const checkIdx = (todayIdx + offset) % 7;
        const day = form.find((d) => d.day_of_week === checkIdx && d.is_open && d.opening_time);
        if (day) {
          const openLabel = formatTime(day.opening_time || undefined);
          const closeLabel = formatTime(day.closing_time || undefined);
          const label = offset === 1 ? 'Amanhã' : DAYS[checkIdx];
          setNextOpen(
            closeLabel
              ? `${label} — ${openLabel} às ${closeLabel}`
              : `${label} às ${openLabel}`,
          );
          break;
        }
      }
      return;
    }

    const [openH, openM] = today.opening_time.split(':').map(Number);
    const [closeH, closeM] = today.closing_time.split(':').map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;

    const isOpenNow = todayMinutes >= openMinutes && todayMinutes < closeMinutes;
    setCurrentOpen(isOpenNow);

    const todayOpenLabel = formatTime(today.opening_time);
    const todayCloseLabel = formatTime(today.closing_time);

    if (isOpenNow) {
      setNextClose(`${todayCloseLabel} (hoje)`);
    } else if (todayMinutes < openMinutes) {
      // Ainda não abriu hoje
      setNextOpen(
        todayCloseLabel
          ? `Hoje — ${todayOpenLabel} às ${todayCloseLabel}`
          : `Hoje às ${todayOpenLabel}`,
      );
    } else {
      // Já passou do horário de fechamento, buscar próximo dia
      for (let offset = 1; offset <= 7; offset++) {
        const checkIdx = (todayIdx + offset) % 7;
        const day = form.find((d) => d.day_of_week === checkIdx && d.is_open && d.opening_time);
        if (day) {
          const openLabel = formatTime(day.opening_time || undefined);
          const closeLabel = formatTime(day.closing_time || undefined);
          const label = offset === 1 ? 'Amanhã' : DAYS[checkIdx];
          setNextOpen(
            closeLabel
              ? `${label} — ${openLabel} às ${closeLabel}`
              : `${label} às ${openLabel}`,
          );
          break;
        }
      }
    }
  }, [form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = form.map((day) => ({
        day_of_week: day.day_of_week,
        is_open: day.is_open,
        opening_time: day.is_open ? (day.opening_time || '08:00') : null,
        closing_time: day.is_open ? (day.closing_time || '18:00') : null,
      }));
      await pharmacyService.updateHours(payload as PharmacyDayHours[]);
      toast.success('Horários atualizados');
      dispatch(fetchPharmacyHoursThunk());
    } catch (e: any) {
      if (e?.code === 'ERR_NETWORK' || e?.message?.includes('Network')) {
        toast.error('Erro de conexão: o servidor backend está offline');
      } else if (e?.response?.status === 403) {
        toast.error('Acesso negado. Apenas administradores podem alterar os horários.');
      } else {
        toast.error(e?.response?.data?.message || 'Falha ao salvar horários');
      }
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (day: PharmacyDayHours) => {
    setEditDay(day);
    setEditLunchStart('');
    setEditLunchEnd('');
    setEditModalOpen(true);
  };

  const saveEditDay = () => {
    if (!editDay) return;
    setForm((prev) => prev.map((d) => (d.day_of_week === editDay.day_of_week ? editDay : d)));
    setEditModalOpen(false);
    toast.success('Dia atualizado (clique Salvar para persistir)');
  };

  const addHoliday = () => {
    if (!holidayForm.date || !holidayForm.name) {
      toast.error('Preencha data e nome');
      return;
    }
    const newH: Holiday = {
      id: Date.now(),
      date: holidayForm.date,
      name: holidayForm.name,
      is_open: holidayForm.is_open || false,
      opening_time: holidayForm.opening_time,
      closing_time: holidayForm.closing_time,
    };
    setHolidays((prev) => [...prev, newH]);
    setHolidayModalOpen(false);
    setHolidayForm({ is_open: false });
  };

  const deleteHoliday = (id: number) => {
    if (!window.confirm('Remover feriado?')) return;
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const todayIndex = new Date().getDay();

  return (
    <PageWrap>
      <PageTitle>Horário de funcionamento</PageTitle>

      {/* Status atual */}
      <StatusCard $state={currentOpen === true ? 'open' : currentOpen === false ? 'closed' : 'unknown'}>
        {currentOpen !== null ? (
          <>
            <StatusEmoji>{currentOpen ? '🟢' : '🔴'}</StatusEmoji>
            <StatusLabel $open={currentOpen}>
              {currentOpen ? 'ABERTO AGORA' : 'FECHADO'}
            </StatusLabel>
            <StatusHint>
              {currentOpen
                ? `Próximo fechamento: ${nextClose || '-'} (hoje)`
                : `Próxima abertura: ${nextOpen || '-'}`}
            </StatusHint>
          </>
        ) : (
          <Muted>Carregando status...</Muted>
        )}
      </StatusCard>

      {/* Horários da semana */}
      <Card>
        <SectionTitle>Horários da semana</SectionTitle>
        <TableScroll>
          <Table>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <Th>Dia</Th>
                <Th $align="center">Status</Th>
                <Th $align="center">Horário</Th>
                <Th $align="center">Almoço</Th>
                <Th $align="center">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {form.map((day) => {
                const isToday = day.day_of_week === todayIndex;
                return (
                  <tr key={day.day_of_week} style={{ borderBottom: '1px solid #f3f4f6', background: isToday ? '#e3f2fd' : undefined }}>
                    <Td style={{ fontWeight: isToday ? 600 : 400 }}>
                      {DAYS[day.day_of_week]}
                      {isToday ? <span style={{ fontSize: 11, color: '#1976d2', marginLeft: 6 }}>(hoje)</span> : null}
                    </Td>
                    <Td $align="center">
                      <Badge $open={!!day.is_open}>{day.is_open ? '🟢 Aberto' : '🔴 Fechado'}</Badge>
                    </Td>
                    <Td $align="center">
                      {day.is_open ? `${day.opening_time || '-'} - ${day.closing_time || '-'}` : 'Fechado'}
                    </Td>
                    <Td $align="center" style={{ color: '#9e9e9e' }}>-</Td>
                    <Td $align="center">
                      {isStaff ? (
                        <SmallBtn type="button" onClick={() => openEdit(day)}>
                          Editar
                        </SmallBtn>
                      ) : null}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableScroll>

        {isStaff ? (
          <ButtonRow>
            <PrimaryBtn type="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </PrimaryBtn>
          </ButtonRow>
        ) : null}
      </Card>

      {/* Feriados */}
      {isStaff ? (
        <Card style={{ marginBottom: 0 }}>
          <SectionHeader>
            <SectionTitle style={{ margin: 0 }}>Horários especiais (Feriados)</SectionTitle>
            <SecondaryBtn type="button" onClick={() => setHolidayModalOpen(true)}>
              + Adicionar feriado
            </SecondaryBtn>
          </SectionHeader>

          {holidays.length === 0 ? (
            <Muted>Nenhum feriado cadastrado.</Muted>
          ) : (
            <TableScroll>
              <Table>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <Th>Data</Th>
                    <Th>Nome</Th>
                    <Th $align="center">Horário</Th>
                    <Th $align="center">Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <Td>{new Date(h.date).toLocaleDateString()}</Td>
                      <Td>{h.name}</Td>
                      <Td $align="center">
                        {h.is_open ? `${h.opening_time || '-'} - ${h.closing_time || '-'}` : (
                          <Badge $open={false}>Fechado</Badge>
                        )}
                      </Td>
                      <Td $align="center">
                        <SmallBtn type="button" onClick={() => deleteHoliday(h.id)}>🗑️</SmallBtn>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableScroll>
          )}
        </Card>
      ) : null}

      {/* Modal editar dia */}
      {editModalOpen && editDay ? (
        <ModalOverlay>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>Editar - {DAYS[editDay.day_of_week]}</ModalTitle>
              <CloseBtn type="button" onClick={() => setEditModalOpen(false)}>✕</CloseBtn>
            </ModalHeader>

            <Field>
              <FieldLabel>Status *</FieldLabel>
              <RadioGroup>
                <RadioLabel>
                  <input type="radio" name="dayStatus" checked={editDay.is_open} onChange={() => setEditDay((d) => d ? { ...d, is_open: true } : d)} /> Aberto
                </RadioLabel>
                <RadioLabel>
                  <input type="radio" name="dayStatus" checked={!editDay.is_open} onChange={() => setEditDay((d) => d ? { ...d, is_open: false } : d)} /> Fechado
                </RadioLabel>
              </RadioGroup>
            </Field>

            {editDay.is_open ? (
              <>
                <Field>
                  <FieldLabel>Horário de abertura</FieldLabel>
                  <TimeRow>
                    <TimeInput type="time" value={editDay.opening_time || ''} onChange={(e) => setEditDay((d) => d ? { ...d, opening_time: e.target.value } : d)} />
                    <span>às</span>
                    <TimeInput type="time" value={editDay.closing_time || ''} onChange={(e) => setEditDay((d) => d ? { ...d, closing_time: e.target.value } : d)} />
                  </TimeRow>
                </Field>
                <Field>
                  <RadioLabel>
                    <input type="checkbox" checked={!!editLunchStart} onChange={(e) => { if (!e.target.checked) { setEditLunchStart(''); setEditLunchEnd(''); } else { setEditLunchStart('12:00'); setEditLunchEnd('13:00'); } }} />
                    Tem intervalo de almoço
                  </RadioLabel>
                  {editLunchStart ? (
                    <TimeRow>
                      <span>Das</span>
                      <TimeInput type="time" value={editLunchStart} onChange={(e) => setEditLunchStart(e.target.value)} />
                      <span>às</span>
                      <TimeInput type="time" value={editLunchEnd} onChange={(e) => setEditLunchEnd(e.target.value)} />
                    </TimeRow>
                  ) : null}
                </Field>
              </>
            ) : null}

            <ButtonRow>
              <SecondaryBtn type="button" onClick={() => setEditModalOpen(false)}>Cancelar</SecondaryBtn>
              <PrimaryBtn type="button" onClick={saveEditDay}>Salvar</PrimaryBtn>
            </ButtonRow>
          </ModalBox>
        </ModalOverlay>
      ) : null}

      {/* Modal adicionar feriado */}
      {holidayModalOpen ? (
        <ModalOverlay>
          <ModalBox>
            <ModalHeader>
              <ModalTitle>Adicionar feriado</ModalTitle>
              <CloseBtn type="button" onClick={() => setHolidayModalOpen(false)}>✕</CloseBtn>
            </ModalHeader>

            <Field>
              <FieldLabel>Nome do feriado *</FieldLabel>
              <TextInput type="text" value={holidayForm.name || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>

            <Field>
              <FieldLabel>Data *</FieldLabel>
              <TextInput type="date" value={holidayForm.date || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, date: e.target.value }))} />
            </Field>

            <Field>
              <FieldLabel>Tipo *</FieldLabel>
              <RadioGroup $column>
                <RadioLabel>
                  <input type="radio" name="holidayType" checked={!holidayForm.is_open} onChange={() => setHolidayForm((f) => ({ ...f, is_open: false }))} /> Fechado todo o dia
                </RadioLabel>
                <RadioLabel>
                  <input type="radio" name="holidayType" checked={holidayForm.is_open === true} onChange={() => setHolidayForm((f) => ({ ...f, is_open: true }))} /> Meio período / Horário diferenciado
                </RadioLabel>
              </RadioGroup>
            </Field>

            {holidayForm.is_open ? (
              <Field>
                <FieldLabel>Horário</FieldLabel>
                <TimeRow>
                  <TimeInput type="time" value={holidayForm.opening_time || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, opening_time: e.target.value }))} />
                  <span>às</span>
                  <TimeInput type="time" value={holidayForm.closing_time || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, closing_time: e.target.value }))} />
                </TimeRow>
              </Field>
            ) : null}

            <ButtonRow>
              <SecondaryBtn type="button" onClick={() => setHolidayModalOpen(false)}>Cancelar</SecondaryBtn>
              <PrimaryBtn type="button" onClick={addHoliday}>Salvar</PrimaryBtn>
            </ButtonRow>
          </ModalBox>
        </ModalOverlay>
      ) : null}
    </PageWrap>
  );
}
