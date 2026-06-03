import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPharmacyHoursThunk } from '../../store/slices/pharmacySlice';
import { pharmacyService, type PharmacyDayHours } from '../../services/pharmacyService';
import { useAuth } from '../../hooks/useAuth';

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
    <div>
      <h2 style={{ marginBottom: 16 }}>Horário de funcionamento</h2>

      {/* Status atual */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, marginBottom: 24, textAlign: 'center', background: currentOpen === true ? '#e8f5e9' : currentOpen === false ? '#ffebee' : '#f5f5f5' }}>
        {currentOpen !== null ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{currentOpen ? '🟢' : '🔴'}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: currentOpen ? '#2e7d32' : '#c62828' }}>
              {currentOpen ? 'ABERTO AGORA' : 'FECHADO'}
            </div>
            <div style={{ fontSize: 14, color: '#616161', marginTop: 8 }}>
              {currentOpen
                ? `Próximo fechamento: ${nextClose || '-'} (hoje)`
                : `Próxima abertura: ${nextOpen || '-'}`}
            </div>
          </>
        ) : (
          <div style={{ color: '#9e9e9e' }}>Carregando status...</div>
        )}
      </div>

      {/* Horários da semana */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, marginBottom: 24 }}>
        <h3 style={{ marginTop: 0, marginBottom: 12 }}>Horários da semana</h3>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Dia</th>
                <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Status</th>
                <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Horário</th>
                <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Almoço</th>
                <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {form.map((day) => {
                const isToday = day.day_of_week === todayIndex;
                return (
                  <tr key={day.day_of_week} style={{ borderBottom: '1px solid #f3f4f6', background: isToday ? '#e3f2fd' : undefined }}>
                    <td style={{ padding: 10, fontWeight: isToday ? 600 : 400 }}>
                      {DAYS[day.day_of_week]}
                      {isToday ? <span style={{ fontSize: 11, color: '#1976d2', marginLeft: 6 }}>(hoje)</span> : null}
                    </td>
                    <td style={{ padding: 10, textAlign: 'center' }}>
                      {day.is_open ? (
                        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#16a34a', background: '#f0fdf4' }}>🟢 Aberto</span>
                      ) : (
                        <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#dc2626', background: '#fef2f2' }}>🔴 Fechado</span>
                      )}
                    </td>
                    <td style={{ padding: 10, textAlign: 'center' }}>
                      {day.is_open ? `${day.opening_time || '-'} - ${day.closing_time || '-'}` : 'Fechado'}
                    </td>
                    <td style={{ padding: 10, textAlign: 'center', color: '#9e9e9e' }}>-</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>
                      {isStaff ? (
                        <button type="button" onClick={() => openEdit(day)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 13 }}>
                          Editar
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {isStaff ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <button type="button" onClick={handleSave} disabled={saving} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2E7D32', color: '#fff', cursor: 'pointer' }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Feriados */}
      {isStaff ? (
        <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Horários especiais (Feriados)</h3>
            <button type="button" onClick={() => setHolidayModalOpen(true)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>
              + Adicionar feriado
            </button>
          </div>

          {holidays.length === 0 ? (
            <p style={{ color: '#9e9e9e' }}>Nenhum feriado cadastrado.</p>
          ) : (
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Data</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>Nome</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Horário</th>
                    <th style={{ padding: 10, borderBottom: '2px solid #e5e7eb', textAlign: 'center' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((h) => (
                    <tr key={h.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: 10 }}>{new Date(h.date).toLocaleDateString()}</td>
                      <td style={{ padding: 10 }}>{h.name}</td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        {h.is_open ? `${h.opening_time || '-'} - ${h.closing_time || '-'}` : (
                          <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, color: '#dc2626', background: '#fef2f2' }}>Fechado</span>
                        )}
                      </td>
                      <td style={{ padding: 10, textAlign: 'center' }}>
                        <button type="button" onClick={() => deleteHoliday(h.id)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {/* Modal editar dia */}
      {editModalOpen && editDay ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Editar - {DAYS[editDay.day_of_week]}</h3>
              <button type="button" onClick={() => setEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Status *</label>
              <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" name="dayStatus" checked={editDay.is_open} onChange={() => setEditDay((d) => d ? { ...d, is_open: true } : d)} /> Aberto
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" name="dayStatus" checked={!editDay.is_open} onChange={() => setEditDay((d) => d ? { ...d, is_open: false } : d)} /> Fechado
                </label>
              </div>
            </div>

            {editDay.is_open ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 14, fontWeight: 500 }}>Horário de abertura</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                    <input type="time" value={editDay.opening_time || ''} onChange={(e) => setEditDay((d) => d ? { ...d, opening_time: e.target.value } : d)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    <span>às</span>
                    <input type="time" value={editDay.closing_time || ''} onChange={(e) => setEditDay((d) => d ? { ...d, closing_time: e.target.value } : d)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={!!editLunchStart} onChange={(e) => { if (!e.target.checked) { setEditLunchStart(''); setEditLunchEnd(''); } else { setEditLunchStart('12:00'); setEditLunchEnd('13:00'); } }} />
                    Tem intervalo de almoço
                  </label>
                  {editLunchStart ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, marginLeft: 24 }}>
                      <span>Das</span>
                      <input type="time" value={editLunchStart} onChange={(e) => setEditLunchStart(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                      <span>às</span>
                      <input type="time" value={editLunchEnd} onChange={(e) => setEditLunchEnd(e.target.value)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={() => setEditModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
              <button type="button" onClick={saveEditDay} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2E7D32', color: '#fff', cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modal adicionar feriado */}
      {holidayModalOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 420 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Adicionar feriado</h3>
              <button type="button" onClick={() => setHolidayModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Nome do feriado *</label>
              <input type="text" value={holidayForm.name || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Data *</label>
              <input type="date" value={holidayForm.date || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', marginTop: 4 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>Tipo *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" name="holidayType" checked={!holidayForm.is_open} onChange={() => setHolidayForm((f) => ({ ...f, is_open: false }))} /> Fechado todo o dia
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="radio" name="holidayType" checked={holidayForm.is_open === true} onChange={() => setHolidayForm((f) => ({ ...f, is_open: true }))} /> Meio período / Horário diferenciado
                </label>
              </div>
            </div>

            {holidayForm.is_open ? (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Horário</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                  <input type="time" value={holidayForm.opening_time || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, opening_time: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <span>às</span>
                  <input type="time" value={holidayForm.closing_time || ''} onChange={(e) => setHolidayForm((f) => ({ ...f, closing_time: e.target.value }))} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                </div>
              </div>
            ) : null}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={() => setHolidayModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>Cancelar</button>
              <button type="button" onClick={addHoliday} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#2E7D32', color: '#fff', cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
