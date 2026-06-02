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

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = useMemo(() => ({ nome: '', email: '', telefone: '', senha: '' }), []);

  return (
    <Page>
      <Card>
        <Header>
          <Title>Criar conta</Title>
          <Subtitle>Preencha seus dados para criar uma conta.</Subtitle>
        </Header>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const result = await dispatch(registerThunk(values as any));
              if (registerThunk.fulfilled.match(result)) {
                toast.success('Cadastro realizado');
                navigate('/medicines', { replace: true });
              } else {
                toast.error((result.payload as string) || 'Falha no cadastro');
              }
            } catch {
              toast.error('Falha no cadastro');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, setFieldValue, isSubmitting, submitForm }) => (
            <Form>
              <Row>
                <Label>Nome</Label>
                <Field name="nome" value={(values as any).nome} onChange={handleChange} />
                {(touched as any).nome && (errors as any).nome ? <Error>{(errors as any).nome}</Error> : null}
              </Row>

              <Row>
                <Label>Email</Label>
                <Field name="email" value={values.email} onChange={handleChange} />
                {touched.email && errors.email ? <Error>{errors.email}</Error> : null}
              </Row>

              <Row>
                <Label>Telefone</Label>
                <Field
                  name="telefone"
                  inputMode="tel"
                  placeholder="(11) 99999-9999"
                  value={(values as any).telefone}
                  onChange={(e) => setFieldValue('telefone', formatPhoneBR(e.target.value))}
                />
                {(touched as any).telefone && (errors as any).telefone ? (
                  <Error>{(errors as any).telefone}</Error>
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
                {(touched as any).senha && (errors as any).senha ? <Error>{(errors as any).senha}</Error> : null}
              </Row>

              <Button type="button" onClick={submitForm} disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Cadastrar'}
              </Button>

              <Links>
                <Link to="/login">Já tenho conta</Link>
              </Links>
            </Form>
          )}
        </Formik>
      </Card>
    </Page>
  );
}
