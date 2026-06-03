import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { stockService, type ConsumedBatch } from '../../services/stockService';

type MovementType = 'entrada' | 'saida' | 'ajuste';

interface MovementFormProps {
  medicineId: number;
  onUpdated?: (medicine: Medicine) => void;
}

interface FormValues {
  tipo: MovementType;
  quantidade: number;
  motivo: string;
  observacao: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  pacienteId: string;
}

const schema = Yup.object({
  tipo: Yup.mixed<MovementType>().oneOf(['entrada', 'saida', 'ajuste']).required('Obrigatório'),
  quantidade: Yup.number().min(1, 'Mínimo 1').required('Obrigatório'),
  motivo: Yup.string().min(2, 'Mínimo 2 caracteres').optional(),
  observacao: Yup.string().optional(),
  batchNumber: Yup.string().when('tipo', {
    is: 'entrada',
    then: (s) => s.required('Obrigatório'),
    otherwise: (s) => s.optional(),
  }),
  manufacturingDate: Yup.string().optional(),
  expiryDate: Yup.string().when('tipo', {
    is: 'entrada',
    then: (s) =>
      s
        .required('Obrigatório')
        .test('future', 'Data deve ser maior que hoje', (value) => {
          if (!value) return false;
          const today = new Date();
          const d = new Date(value);
          return d > new Date(today.getFullYear(), today.getMonth(), today.getDate());
        }),
    otherwise: (s) => s.optional(),
  }),
  pacienteId: Yup.string().optional(),
});

export default function MovementForm({ medicineId, onUpdated }: MovementFormProps) {
  const initialValues: FormValues = {
    tipo: 'entrada',
    quantidade: 1,
    motivo: '',
    observacao: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    pacienteId: '',
  };

  const handleReloadMedicine = async () => {
    try {
      const data = await medicineService.getById(medicineId);
      onUpdated?.(data);
    } catch {
      // silencioso
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
        setStatus(undefined);
        try {
          if (!medicineId) return;

          if (values.tipo === 'ajuste') {
            const delta = Math.abs(values.quantidade);
            const updated = await medicineService.patchStock(medicineId, {
              delta,
              motivo: values.motivo || 'ajuste',
              observacao: values.observacao || undefined,
            });
            onUpdated?.(updated);
            toast.success('Ajuste registrado');
            resetForm();
            return;
          }

          if (values.tipo === 'entrada') {
            const payload = {
              medicineId,
              type: 'entrada' as const,
              batchNumber: values.batchNumber.trim(),
              quantity: Number(values.quantidade) || 0,
              expiryDate: values.expiryDate,
              manufacturingDate: values.manufacturingDate || null,
              motivo: values.motivo || undefined,
              observacao: values.observacao || undefined,
            };

            const res = await stockService.createEntrada(payload);
            if (!res.success) {
              const msg = res.message || 'Falha ao registrar entrada';
              toast.error(msg);
              return;
            }

            toast.success(res.message || 'Entrada registrada');
            await handleReloadMedicine();
            resetForm();
            return;
          }

          if (values.tipo === 'saida') {
            const payload = {
              medicineId,
              type: 'saida' as const,
              quantity: Number(values.quantidade) || 0,
              motivo: values.motivo || undefined,
              pacienteId: values.pacienteId || undefined,
              observacao: values.observacao || undefined,
            };

            try {
              const res = await stockService.createSaida(payload);
              if (!res.success) {
                const msg = res.message || 'Falha ao registrar saída';
                toast.error(msg);
                return;
              }

              const consumed = (res.data?.consumed || []) as ConsumedBatch[];
              setStatus({ consumed });
              toast.success(res.message || 'Saída registrada');
              await handleReloadMedicine();
              resetForm();
            } catch (e: any) {
              if (e?.response?.status === 409) {
                toast.error(e?.response?.data?.message || 'Estoque insuficiente');
              } else {
                toast.error('Falha ao registrar saída');
              }
            }
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, handleChange, touched, errors, isSubmitting, setFieldValue, status }) => (
        <Form style={{ display: 'grid', gap: 20 }}>
          {/* Tipo */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 10, color: '#333' }}>
              Tipo de movimentação *
            </label>
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
            {touched.tipo && errors.tipo ? (
              <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.tipo as any}</div>
            ) : null}
          </div>

          {/* Campos específicos de entrada */}
          {values.tipo === 'entrada' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
                  Nº do lote *
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={values.batchNumber}
                  onChange={handleChange}
                  placeholder="Ex: L2026-0001"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
                />
                {touched.batchNumber && errors.batchNumber ? (
                  <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.batchNumber}</div>
                ) : null}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
                  Fabricação
                </label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={values.manufacturingDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
                  Validade *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={values.expiryDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
                />
                {touched.expiryDate && errors.expiryDate ? (
                  <div style={{ color: '#D32F2F', fontSize: 13, marginTop: 6 }}>{errors.expiryDate}</div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Quantidade */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
              Quantidade *
            </label>
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

          {/* Motivo + Paciente */}
          <div style={{ display: 'grid', gridTemplateColumns: values.tipo === 'saida' ? '2fr 1fr' : '1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
                Motivo
              </label>
              <input
                type="text"
                name="motivo"
                value={values.motivo}
                onChange={handleChange}
                placeholder={values.tipo === 'entrada' ? 'Ex: compra' : values.tipo === 'saida' ? 'Ex: dispensação' : 'Ex: ajuste inventário'}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
              />
            </div>

            {values.tipo === 'saida' ? (
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
                  ID do paciente
                </label>
                <input
                  type="text"
                  name="pacienteId"
                  value={values.pacienteId}
                  onChange={handleChange}
                  placeholder="Opcional"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
                />
              </div>
            ) : null}
          </div>

          {/* Observação */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 8, color: '#333' }}>
              Observação (opcional)
            </label>
            <textarea
              name="observacao"
              value={values.observacao}
              onChange={handleChange}
              rows={3}
              placeholder="Detalhes adicionais..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15, resize: 'vertical' }}
            />
          </div>

          {/* Resultado de saída (lotes consumidos) */}
          {status?.consumed && (status.consumed as ConsumedBatch[]).length > 0 ? (
            <div style={{ borderRadius: 12, border: '1px solid #e5e7eb', padding: 16, background: '#f9fafb' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Lotes consumidos</div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#374151' }}>
                {(status.consumed as ConsumedBatch[]).map((c) => (
                  <li key={`${c.batchId}-${c.batchNumber}`}>
                    Lote <strong>{c.batchNumber}</strong> 
                    {' '}- {c.quantity} un (validade {new Date(c.expiryDate).toLocaleDateString('pt-BR')})
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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
          </div>
        </Form>
      )}
    </Formik>
  );
}
