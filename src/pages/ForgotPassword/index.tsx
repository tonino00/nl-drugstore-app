import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiArrowLeft, FiSend } from 'react-icons/fi';

import { authService } from '../../services/authService';

import {
  Page,
  Card,
  Header,
  IconCircle,
  Title,
  Subtitle,
  Row,
  Label,
  InputWrap,
  InputIcon,
  Field,
  Error,
  Button,
  BackLink,
  SuccessMessage,
} from '../../styles/pages/Auth/ForgotPassword/styles';

const schema = Yup.object({
  email: Yup.string().email('Email inválido').required('Obrigatório'),
});

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
          <IconCircle>
            <FiMail />
          </IconCircle>
          <Title>Recuperar senha</Title>
          <Subtitle>
            Digite seu email e enviaremos instruções para redefinir sua senha.
          </Subtitle>
        </Header>
        {success && (
          <SuccessMessage>
            ✓ Se existir uma conta, enviaremos instruções por email.
          </SuccessMessage>
        )}

        <Formik
          initialValues={{ email: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              setError('');
              setSuccess(false);
              await authService.forgotPassword(values.email);
              setSuccess(true);
              toast.success('Se existir uma conta, enviaremos instruções por email.');
              resetForm();
              setTimeout(() => {
                setSuccess(false);
              }, 5000);
            } catch {
              const errorMsg = 'Falha ao solicitar recuperação';
              setError(errorMsg);
              toast.error(errorMsg);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, isSubmitting, errors, touched }) => (
            <Form>
              <Row>
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
                {touched.email && errors.email ? <Error>⚠ {errors.email}</Error> : null}
                {error && !touched.email ? <Error>⚠ {error}</Error> : null}
              </Row>

              <Button type="submit" disabled={isSubmitting} $loading={isSubmitting}>
                {isSubmitting ? '' : (
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
