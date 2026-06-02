import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';

type FormValues = {
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo: string;
  observacao: string;
};

const schema = Yup.object({
  tipo: Yup.mixed<'entrada' | 'saida' | 'ajuste'>().oneOf(['entrada', 'saida', 'ajuste']).required('Obrigatório'),
  quantidade: Yup.number().min(1, 'Mínimo 1').required('Obrigatório'),
  motivo: Yup.string().min(2, 'Mínimo 2 caracteres').required('Obrigatório'),
  observacao: Yup.string().optional(),
});

export default function StockControlPage() {
  const { medicineId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user?.role === 'pharmacist' || user?.role === 'admin';

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!medicineId) return;
        setLoading(true);
        const data = await medicineService.getById(medicineId);
        if (mounted) setMedicine(data);
      } catch {
        toast.error('Falha ao carregar medicamento');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [medicineId]);

  if (!isStaff) {
    return (
      <div>
        <h2>Controle de estoque</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  const initialValues: FormValues = {
    tipo: 'entrada',
    quantidade: 1,
    motivo: 'compra',
    observacao: '',
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link to={`/medicines/${medicineId}`} style={{ color: '#616161', textDecoration: 'none', fontSize: 14 }}>← Voltar</Link>
        <h2 style={{ margin: 0 }}>Controle de estoque</h2>
      </div>

      {loading ? (
        <p style={{ color: '#9e9e9e' }}>Carregando...</p>
      ) : null}

      {/* Card do medicamento */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, marginBottom: 24, background: '#fff' }}>
        <div style={{ fontSize: 13, color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Medicamento</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#333', marginBottom: 16 }}>{medicine?.nome || '-'}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
          <div style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: '#f9fafb' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1976d2' }}>{medicine?.quantidade ?? 0}</div>
            <div style={{ fontSize: 12, color: '#9e9e9e' }}>Estoque atual</div>
          </div>
          <div style={{ textAlign: 'center', padding: 12, borderRadius: 8, background: '#f9fafb' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2e7d32' }}>{medicine?.quantidade_minima ?? 0}</div>
            <div style={{ fontSize: 12, color: '#9e9e9e' }}>Mínimo</div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, background: '#fff' }}>
        <h3 style={{ marginTop: 0, marginBottom: 20, fontSize: 18 }}>Nova movimentação</h3>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              if (!medicineId) return;

              const delta = values.tipo === 'saida' ? -Math.abs(values.quantidade) : Math.abs(values.quantidade);

              const updated = await medicineService.patchStock(medicineId, {
                delta,
                motivo: values.motivo,
                observacao: values.observacao || undefined,
              });

              setMedicine(updated);
              toast.success('Movimentação registrada');
              resetForm();
            } catch (e: any) {
              toast.error(e?.response?.data?.message || 'Falha ao registrar movimentação');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting, setFieldValue }) => (
            <Form style={{ display: 'grid', gap: 20 }}>
              {/* Tipo */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 10, color: '#333' }}>Tipo de movimentação *</label>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    { value: 'entrada', label: 'Entrada', color: '#2E7D32' },
                    { value: 'saida', label: 'Saída', color: '#D32F2F' },
                    { value: 'ajuste', label: 'Ajuste', color: '#1976d2' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFieldValue('tipo', opt.value)}
                      style={{
                        flex: 1,
                        minWidth: 100,
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: values.tipo === opt.value ? `2px solid ${opt.color}` : '2px solid #e5e7eb',
                        background: values.tipo === opt.value ? `${opt.color}10` : '#fff',
                        color: values.tipo === opt.value ? opt.color : '#616161',
                        fontWeight: values.tipo === opt.value ? 600 : 400,
                        cursor: 'pointer',
                        fontSize: 14,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {touched.tipo && errors.tipo ? <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.tipo as any}</div> : null}
              </div>

              {/* Quantidade */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Quantidade *</label>
                <input
                  type="number"
                  name="quantidade"
                  value={values.quantidade}
                  onChange={handleChange}
                  min={1}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
                />
                {touched.quantidade && errors.quantidade ? (
                  <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.quantidade}</div>
                ) : null}
              </div>

              {/* Motivo */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Motivo *</label>
                <select
                  name="motivo"
                  value={values.motivo}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, background: '#fff' }}
                >
                  <optgroup label="Entrada">
                    <option value="compra">Compra</option>
                    <option value="doação">Doação</option>
                    <option value="devolução de paciente">Devolução de paciente</option>
                    <option value="transferência">Transferência</option>
                  </optgroup>
                  <optgroup label="Saída">
                    <option value="retirada paciente">Retirada paciente</option>
                    <option value="perda">Perda</option>
                    <option value="vencimento">Vencimento</option>
                    <option value="doação">Doação</option>
                  </optgroup>
                  <optgroup label="Ajuste">
                    <option value="ajuste positivo">Ajuste positivo</option>
                    <option value="ajuste negativo">Ajuste negativo</option>
                  </optgroup>
                </select>
                {touched.motivo && errors.motivo ? <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.motivo}</div> : null}
              </div>

              {/* Observação */}
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>Observação (opcional)</label>
                <textarea
                  name="observacao"
                  value={values.observacao}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detalhes adicionais..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, resize: 'vertical' }}
                />
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#2E7D32',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrar movimentação'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/stock/movements/${medicineId}`)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                    color: '#616161',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  Ver histórico
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
