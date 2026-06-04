import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

import { authService } from '../../services/authService';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray};
  line-height: 1.5;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.danger};

  p {
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
`;

const FieldGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InputWrap = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1.1rem;
`;

const Field = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 44px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1.5px solid ${({ theme }) => theme.colors.grayLight};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.colors.black};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: background 0.2s, transform 0.1s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const schema = Yup.object({
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
});

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';

  return (
    <Container>
      <Card>
        <Header>
          <IconCircle>
            <FiLock />
          </IconCircle>
          <Title>Redefinir senha</Title>
          <Subtitle>
            Crie uma nova senha segura para sua conta.
          </Subtitle>
        </Header>

        {!token ? (
          <ErrorState>
            <FiAlertCircle size={48} />
            <p>Token inválido ou expirado.</p>
          </ErrorState>
        ) : (
          <Formik
            initialValues={{ password: '' }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await authService.resetPassword(token, values.password);
                toast.success('Senha atualizada com sucesso!');
                setTimeout(() => navigate('/login'), 1500);
              } catch {
                toast.error('Falha ao redefinir senha');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, isSubmitting, errors, touched }) => (
              <Form>
                <FieldGroup>
                  <Label htmlFor="password">Nova senha</Label>
                  <InputWrap>
                    <InputIcon>
                      <FiLock />
                    </InputIcon>
                    <Field
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Digite sua nova senha"
                      value={values.password}
                      onChange={handleChange}
                    />
                  </InputWrap>
                  {touched.password && errors.password ? (
                    <ErrorText>{errors.password}</ErrorText>
                  ) : null}
                </FieldGroup>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    'Salvando...'
                  ) : (
                    <>
                      <FiCheckCircle />
                      Salvar nova senha
                    </>
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        )}

        <BackLink to="/login">
          <FiArrowLeft />
          Voltar para o login
        </BackLink>
      </Card>
    </Container>
  );
}
