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
  Logo,
  BrandingInfo,
  SuccessMessage,
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/medicines';

  return (
    <Page>
      <div style={{ 
        position: 'absolute', 
        top: '40px', 
        left: '40px',
        color: 'white',
        fontSize: '2rem',
        fontWeight: '700',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1
      }}>
        💊 NL Drugstore
      </div>
      <Card>
        <Header>
          <Title>Bem-vindo</Title>
          <Subtitle>Acesse sua conta para gerenciar sua farmácia</Subtitle>
        </Header>
        {loginSuccess && (
          <SuccessMessage>
            ✓ Login realizado com sucesso!
          </SuccessMessage>
        )}
        <Formik
          initialValues={{ email: '', senha: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setLoginError('');
              setLoginSuccess(false);
              const result = await dispatch(loginThunk(values));
              if (loginThunk.fulfilled.match(result)) {
                setLoginSuccess(true);
                toast.success('Login realizado com sucesso');
                setTimeout(() => {
                  navigate(from, { replace: true });
                }, 1500);
              } else {
                const errorMsg = (result.payload as string) || 'Falha no login';
                setLoginError(errorMsg);
                toast.error(errorMsg);
              }
            } catch {
              const errorMsg = 'Falha no login';
              setLoginError(errorMsg);
              toast.error(errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting, submitForm }) => (
            <Form>
              <Row>
                <Label>Email</Label>
                <Field 
                  name="email" 
                  value={values.email} 
                  onChange={handleChange}
                  placeholder="seu@email.com"
                />
                {touched.email && errors.email ? <Error>⚠ {errors.email}</Error> : null}
              </Row>

              <Row>
                <Label>Senha</Label>
                <PasswordWrap>
                  <PasswordField
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={values.senha}
                    onChange={handleChange}
                    placeholder="••••••••"
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
                {touched.senha && errors.senha ? <Error>⚠ {errors.senha}</Error> : null}
                {loginError && !touched.senha && <Error>⚠ {loginError}</Error>}
              </Row>

              <Button
                type="button"
                onClick={submitForm}
                disabled={isSubmitting || loginSuccess}
                data-loading={isSubmitting}
                $loading={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="button-spinner" aria-hidden />
                    <span className="button-label">Entrando...</span>
                  </>
                ) : (
                  <span className="button-label">Entrar</span>
                )}
              </Button>

              <Links>
                <Link to="/forgot-password">Esqueci minha senha</Link>
                <Link to="/register">Criar nova conta</Link>
              </Links>
            </Form>
          )}
        </Formik>
      </Card>
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '0.75rem',
        textAlign: 'center',
        zIndex: 1
      }}>
        © Copyright toninosdev.com 2026.<br />
        Todos os direitos reservados
      </div>
    </Page>
  );
}
