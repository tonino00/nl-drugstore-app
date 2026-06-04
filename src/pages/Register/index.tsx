import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerThunk } from '../../store/slices/authSlice';

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
  SuccessMessage,
  PasswordStrength,
  PasswordStrengthText,
} from '../../styles/pages/Auth/Register/styles';

const schema = Yup.object({
  nome: Yup.string().min(3, 'Mínimo 3 caracteres').required('Obrigatório'),
  email: Yup.string().email('Email inválido').required('Obrigatório'),
  telefone: Yup.string().optional(),
  senha: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
});

const formatPhoneBR = (input: string) => {
  const digits = (input || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthText = (strength: number): string => {
  if (strength <= 2) return 'Senha fraca';
  if (strength <= 3) return 'Senha média';
  return 'Senha forte';
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const initialValues = useMemo(() => ({ nome: '', email: '', telefone: '', senha: '' }), []);

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
          <Title>Criar conta</Title>
          <Subtitle>Preencha seus dados para acessar o sistema</Subtitle>
        </Header>
        {registerSuccess && (
          <SuccessMessage>
            ✓ Conta criada com sucesso!
          </SuccessMessage>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setRegisterError('');
              setRegisterSuccess(false);
              const result = await dispatch(registerThunk(values as any));
              if (registerThunk.fulfilled.match(result)) {
                setRegisterSuccess(true);
                toast.success('Cadastro realizado com sucesso');
                setTimeout(() => {
                  navigate('/medicines', { replace: true });
                }, 1500);
              } else {
                const errorMsg = (result.payload as string) || 'Falha no cadastro';
                setRegisterError(errorMsg);
                toast.error(errorMsg);
              }
            } catch {
              const errorMsg = 'Falha no cadastro';
              setRegisterError(errorMsg);
              toast.error(errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, setFieldValue, isSubmitting, submitForm }) => {
            const passwordStrength = getPasswordStrength((values as any).senha || '');
            
            return (
              <Form>
              <Row>
                <Label>Nome completo</Label>
                <Field 
                  name="nome" 
                  value={(values as any).nome} 
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                />
                {(touched as any).nome && (errors as any).nome ? <Error>⚠ {(errors as any).nome}</Error> : null}
              </Row>

              <Row>
                <Label>Email</Label>
                <Field 
                  name="email" 
                  value={values.email} 
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  type="email"
                />
                {touched.email && errors.email ? <Error>⚠ {errors.email}</Error> : null}
              </Row>

              <Row>
                <Label>Telefone (opcional)</Label>
                <Field
                  name="telefone"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={(values as any).telefone}
                  onChange={(e) => setFieldValue('telefone', formatPhoneBR(e.target.value))}
                />
                {(touched as any).telefone && (errors as any).telefone ? (
                  <Error>⚠ {(errors as any).telefone}</Error>
                ) : null}
              </Row>

              <Row>
                <Label>Senha</Label>
                <PasswordWrap>
                  <PasswordField
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={(values as any).senha}
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
                {(touched as any).senha && (errors as any).senha ? <Error>⚠ {(errors as any).senha}</Error> : null}
                {registerError && !touched.senha && <Error>⚠ {registerError}</Error>}
                {(values as any).senha && (
                  <>
                    <PasswordStrength $strength={passwordStrength} />
                    <PasswordStrengthText>
                      Força da senha: {getPasswordStrengthText(passwordStrength)}
                    </PasswordStrengthText>
                  </>
                )}
              </Row>

              <Button 
                type="button" 
                onClick={submitForm} 
                disabled={isSubmitting}
                $loading={isSubmitting}
              >
                {isSubmitting ? '' : 'Cadastrar'}
              </Button>

              <Links>
                <Link to="/login">Já tenho conta</Link>
              </Links>
            </Form>
            );
          }}
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
