import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
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
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
});

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';

  return (
    <Wrap>
      <h2>Redefinir senha</h2>
      {!token ? (
        <p>Token inválido.</p>
      ) : (
        <Formik
          initialValues={{ password: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await authService.resetPassword(token, values.password);
              toast.success('Senha atualizada');
            } catch {
              toast.error('Falha ao redefinir senha');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }) => (
            <Form>
              <div style={{ marginBottom: 12 }}>
                <label>Nova senha</label>
                <Field
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                {touched.password && errors.password ? (
                  <div style={{ color: '#D32F2F', marginTop: 6 }}>{errors.password}</div>
                ) : null}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </Form>
          )}
        </Formik>
      )}

      <div style={{ marginTop: 12 }}>
        <Link to="/login">Voltar</Link>
      </div>
    </Wrap>
  );
}
