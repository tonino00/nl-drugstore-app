import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk } from '../../store/slices/authSlice';

import {
  Button,
  Card,
  Error,
  Field,
  Header,
  Label,
  Links,
  Page,
  PasswordField,
  PasswordToggle,
  PasswordWrap,
  Row,
  Subtitle,
  Title,
} from '../../styles/pages/Auth/Login/styles';

const schema = Yup.object({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/medicines';

  return (
    <Page>
      <Card>
        <Header>
          <Title>Entrar</Title>
          <Subtitle>Acesse sua conta para continuar.</Subtitle>
        </Header>
        <Formik
          initialValues={{ email: '', senha: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await dispatch(loginThunk(values));
              if (loginThunk.fulfilled.match(result)) {
                toast.success('Login realizado');
                navigate(from, { replace: true });
              } else {
                toast.error((result.payload as string) || 'Falha no login');
              }
            } catch {
              toast.error('Falha no login');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting, submitForm }) => (
            <Form>
              <Row>
                <Label>Email</Label>
                <Field name="email" value={values.email} onChange={handleChange} />
                {touched.email && errors.email ? <Error>{errors.email}</Error> : null}
              </Row>

              <Row>
                <Label>Senha</Label>
                <PasswordWrap>
                  <PasswordField
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={values.senha}
                    onChange={handleChange}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
                  </PasswordToggle>
                </PasswordWrap>
                {touched.senha && errors.senha ? <Error>{errors.senha}</Error> : null}
              </Row>

              <Button type="button" onClick={submitForm} disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>

              <Links>
                <Link to="/forgot-password">Esqueci a senha</Link>
                <Link to="/register">Criar conta</Link>
              </Links>
            </Form>
          )}
        </Formik>
      </Card>
    </Page>
  );
}
