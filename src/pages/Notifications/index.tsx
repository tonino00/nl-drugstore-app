import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import type { Notification, NotificationType } from '../../types/notification.types';
import NotificationList from '../../components/Notification/NotificationList';
import { notificationService } from '../../services/notificationService';
import { useAppDispatch } from '../../store/hooks';
import { markAllAsRead, setNotifications } from '../../store/slices/notificationSlice';

const TYPE_LABELS: Record<NotificationType, string> = {
  stock: 'Estoque',
  expiry: 'Validade',
  favorite_restock: 'Favorito',
  system: 'Sistema',
  sla_warning: 'SLA',
};

const TYPE_COLORS: Record<NotificationType, { color: string; bg: string }> = {
  stock: { color: '#d97706', bg: '#fffbeb' },
  expiry: { color: '#dc2626', bg: '#fef2f2' },
  favorite_restock: { color: '#7c3aed', bg: '#f3e8ff' },
  system: { color: '#2563eb', bg: '#eff6ff' },
  sla_warning: { color: '#ea580c', bg: '#fff7ed' },
};

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread'>('all');
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await notificationService.list({ page: 1, limit: 50 });
        if (mounted) {
          setItems(data.items);
          dispatch(setNotifications(data.items));
        }
      } catch {
        toast.error('Falha ao carregar notificações');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = items.length;
    const unread = items.filter((n) => !n.read).length;
    return { total, unread };
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterStatus === 'unread') {
      result = result.filter((n) => !n.read);
    }
    if (filterType !== 'all') {
      result = result.filter((n) => n.type === filterType);
    }
    return result;
  }, [items, filterStatus, filterType]);

  const FilterButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 20,
        border: active ? '1px solid #1976d2' : '1px solid #e5e7eb',
        background: active ? '#e3f2fd' : '#fff',
        color: active ? '#1976d2' : '#616161',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Header com stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Central de notificações</h2>
        <button
          type="button"
          onClick={async () => {
            try {
              await notificationService.markAllAsRead();
              dispatch(markAllAsRead());
              setItems((prev) => prev.map((n) => ({ ...n, read: true })));
              toast.success('Tudo marcado como lido');
            } catch {
              toast.error('Falha ao marcar como lido');
            }
          }}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            color: '#616161',
          }}
        >
          Marcar tudo como lido
        </button>
      </div>

      {/* Cards de stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1976d2' }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: '#9e9e9e' }}>Total</div>
        </div>
        <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{stats.unread}</div>
          <div style={{ fontSize: 12, color: '#9e9e9e' }}>Não lidas</div>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterButton active={filterStatus === 'all'} label="Todas" onClick={() => setFilterStatus('all')} />
          <FilterButton active={filterStatus === 'unread'} label={`Não lidas ${stats.unread > 0 ? `(${stats.unread})` : ''}`} onClick={() => setFilterStatus('unread')} />
        </div>
        <div style={{ width: 1, height: 24, background: '#e5e7eb' }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterButton active={filterType === 'all'} label="Todos tipos" onClick={() => setFilterType('all')} />
          {(Object.keys(TYPE_LABELS) as NotificationType[]).map((key) => (
            <FilterButton
              key={key}
              active={filterType === key}
              label={TYPE_LABELS[key]}
              onClick={() => setFilterType(filterType === key ? 'all' : key)}
            />
          ))}
        </div>
        {loading ? <span style={{ fontSize: 13, color: '#9e9e9e' }}>Carregando...</span> : null}
      </div>

      {/* Contador */}
      <div style={{ fontSize: 13, color: '#9e9e9e', marginBottom: 12 }}>
        {filteredItems.length} notificação{filteredItems.length !== 1 ? 's' : ''}
      </div>

      {/* Lista */}
      {filteredItems.length === 0 && !loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9e9e9e', borderRadius: 12, border: '1px dashed #e5e7eb' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 16 }}>Nenhuma notificação encontrada</div>
        </div>
      ) : (
        <NotificationList items={filteredItems} />
      )}
    </div>
  );
}
