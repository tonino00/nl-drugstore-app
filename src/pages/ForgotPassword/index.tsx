import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';

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
  email: Yup.string().email('Email inválido').required('Obrigatório'),
});

export default function ForgotPasswordPage() {
  return (
    <Container>
      <Card>
        <Header>
          <IconCircle>
            <FiMail />
          </IconCircle>
          <Title>Recuperar senha</Title>
          <Subtitle>
            Digite seu email e enviaremos instruções para redefinir sua senha.
          </Subtitle>
        </Header>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await authService.forgotPassword(values.email);
              toast.success('Se existir uma conta, enviaremos instruções por email.');
              resetForm();
            } catch {
              toast.error('Falha ao solicitar recuperação');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }) => (
            <Form>
              <FieldGroup>
                <Label htmlFor="email">Email</Label>
                <InputWrap>
                  <InputIcon>
                    <FiMail />
                  </InputIcon>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={values.email}
                    onChange={handleChange}
                  />
                </InputWrap>
                {touched.email && errors.email ? (
                  <ErrorText>{errors.email}</ErrorText>
                ) : null}
              </FieldGroup>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <FiSend />
                    Enviar
                  </>
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <BackLink to="/login">
          <FiArrowLeft />
          Voltar para o login
        </BackLink>
      </Card>
    </Container>
  );
}
