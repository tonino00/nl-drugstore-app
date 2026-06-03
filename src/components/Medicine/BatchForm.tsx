import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import toast from 'react-hot-toast';

import { batchService } from '../../services/batchService';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
    margin: 0 16px;
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.grayDark};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &.full {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black};
`;

const Input = styled.input`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ErrorText = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: ${({ $variant, theme }) =>
    $variant === 'ghost' ? `1px solid ${theme.colors.grayLight}` : 'none'};
  background: ${({ $variant, theme }) =>
    $variant === 'ghost' ? theme.colors.white : theme.colors.primary};
  color: ${({ $variant, theme }) =>
    $variant === 'ghost' ? theme.colors.grayDark : theme.colors.white};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

interface BatchFormProps {
  medicineId: number;
  onClose: () => void;
  onCreated?: () => void;
}

interface FormValues {
  batchNumber: string;
  quantity: number;
  manufacturingDate: string;
  expiryDate: string;
  notes: string;
}

const schema = Yup.object({
  batchNumber: Yup.string().required('Obrigatório'),
  quantity: Yup.number().min(0, 'Mínimo 0').required('Obrigatório'),
  manufacturingDate: Yup.string().optional(),
  expiryDate: Yup.string()
    .required('Obrigatório')
    .test('future', 'Data deve ser maior que hoje', (value) => {
      if (!value) return false;
      const today = new Date();
      const d = new Date(value);
      return d > new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }),
  notes: Yup.string().optional(),
});

export default function BatchForm({ medicineId, onClose, onCreated }: BatchFormProps) {
  const initialValues: FormValues = {
    batchNumber: '',
    quantity: 0,
    manufacturingDate: '',
    expiryDate: '',
    notes: '',
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Novo lote</Title>
          <CloseBtn type="button" onClick={onClose} aria-label="Fechar">✕</CloseBtn>
        </Header>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const payload = {
                batchNumber: values.batchNumber.trim(),
                quantity: Number(values.quantity) || 0,
                manufacturingDate: values.manufacturingDate || null,
                expiryDate: values.expiryDate,
                notes: values.notes || null,
              };

              const res = await batchService.createForMedicine(medicineId, payload);

              if (!res.success) {
                const msg = res.message || 'Falha ao cadastrar lote';
                toast.error(msg);
                return;
              }

              toast.success(res.message || 'Lote cadastrado com sucesso');
              resetForm();
              onCreated?.();
              onClose();
            } catch (e: any) {
              const msg = e?.response?.data?.message || 'Falha ao cadastrar lote';
              const errors = e?.response?.data?.errors as Array<{ message?: string }> | undefined;
              if (errors?.length) {
                toast.error(errors[0].message || msg);
              } else {
                toast.error(msg);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form>
              <Grid>
                <FieldGroup className="full">
                  <Label>Nº do lote *</Label>
                  <Input
                    name="batchNumber"
                    value={values.batchNumber}
                    onChange={handleChange}
                    placeholder="Ex: L2026-0001"
                  />
                  {touched.batchNumber && errors.batchNumber ? (
                    <ErrorText>{errors.batchNumber}</ErrorText>
                  ) : null}
                </FieldGroup>

                <FieldGroup>
                  <Label>Quantidade *</Label>
                  <Input
                    type="number"
                    name="quantity"
                    min={0}
                    value={values.quantity}
                    onChange={handleChange}
                  />
                  {touched.quantity && errors.quantity ? (
                    <ErrorText>{errors.quantity}</ErrorText>
                  ) : null}
                </FieldGroup>

                <FieldGroup>
                  <Label>Data de fabricação</Label>
                  <Input
                    type="date"
                    name="manufacturingDate"
                    value={values.manufacturingDate}
                    onChange={handleChange}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Label>Data de validade *</Label>
                  <Input
                    type="date"
                    name="expiryDate"
                    value={values.expiryDate}
                    onChange={handleChange}
                  />
                  {touched.expiryDate && errors.expiryDate ? (
                    <ErrorText>{errors.expiryDate}</ErrorText>
                  ) : null}
                </FieldGroup>

                <FieldGroup className="full">
                  <Label>Observações</Label>
                  <TextArea
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    placeholder="Informações adicionais sobre o lote, se necessário"
                  />
                </FieldGroup>
              </Grid>

              <Footer>
                <Button type="button" $variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar lote'}
                </Button>
              </Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </Overlay>
  );
}
