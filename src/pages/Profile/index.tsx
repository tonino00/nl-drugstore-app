import { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useAppDispatch } from '../../store/hooks';
import { meThunk } from '../../store/slices/authSlice';

const profileSchema = Yup.object({
  nome: Yup.string().min(2, 'Mínimo 2 caracteres').required('Obrigatório'),
  telefone: Yup.string().optional(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
  newPassword: Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Senhas não coincidem')
    .required('Obrigatório'),
});

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return <div>Carregando...</div>;

  return (
    <div style={{ maxWidth: 720 }}>
      <h2>Perfil</h2>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Dados pessoais</h3>
        <Formik
          initialValues={{ nome: user.nome || '', telefone: user.telefone || '' }}
          validationSchema={profileSchema}
          onSubmit={async (values) => {
            try {
              setSavingProfile(true);
              await authService.updateProfile({ nome: values.nome, telefone: values.telefone || undefined });
              dispatch(meThunk());
              toast.success('Perfil atualizado');
            } catch {
              toast.error('Falha ao atualizar perfil');
            } finally {
              setSavingProfile(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Nome</label>
                <input name="nome" value={values.nome} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                {touched.nome && errors.nome ? <div style={{ color: '#D32F2F', fontSize: 12 }}>{errors.nome}</div> : null}
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Email</label>
                <input value={user.email} disabled style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#f5f5f5' }} />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Telefone</label>
                <input name="telefone" value={values.telefone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>

              <button type="submit" disabled={isSubmitting || savingProfile} style={{ justifySelf: 'start', padding: '10px 24px', background: '#2E7D32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                {savingProfile ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Alterar senha</h3>
        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={passwordSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              setSavingPassword(true);
              await authService.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
              });
              toast.success('Senha alterada');
              resetForm();
            } catch {
              toast.error('Falha ao alterar senha');
            } finally {
              setSavingPassword(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Senha atual</label>
                <input type="password" name="currentPassword" value={values.currentPassword} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                {touched.currentPassword && errors.currentPassword ? <div style={{ color: '#D32F2F', fontSize: 12 }}>{errors.currentPassword}</div> : null}
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Nova senha</label>
                <input type="password" name="newPassword" value={values.newPassword} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                {touched.newPassword && errors.newPassword ? <div style={{ color: '#D32F2F', fontSize: 12 }}>{errors.newPassword}</div> : null}
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 500 }}>Confirmar nova senha</label>
                <input type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                {touched.confirmPassword && errors.confirmPassword ? <div style={{ color: '#D32F2F', fontSize: 12 }}>{errors.confirmPassword}</div> : null}
              </div>

              <button type="submit" disabled={isSubmitting || savingPassword} style={{ justifySelf: 'start', padding: '10px 24px', background: '#1976D2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                {savingPassword ? 'Alterando...' : 'Alterar senha'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
