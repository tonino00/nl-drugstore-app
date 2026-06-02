import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authService } from '../../services/authService';

const Wrap = styled.div`
  max-width: 420px;
  margin: 72px auto;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Field = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
`;

const schema = Yup.object({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
});

export default function ForgotPasswordPage() {
  return (
    <Wrap>
      <h2>Recuperar senha</h2>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await authService.forgotPassword(values.email);
            toast.success('Se existir uma conta, enviaremos instruções por email.');
          } catch {
            toast.error('Falha ao solicitar recuperação');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, isSubmitting, errors, touched }) => (
          <Form>
            <div style={{ marginBottom: 12 }}>
              <label>Email</label>
              <Field name="email" value={values.email} onChange={handleChange} />
              {touched.email && errors.email ? (
                <div style={{ color: '#D32F2F', marginTop: 6 }}>{errors.email}</div>
              ) : null}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>

            <div style={{ marginTop: 12 }}>
              <Link to="/login">Voltar</Link>
            </div>
          </Form>
        )}
      </Formik>
    </Wrap>
  );
}
