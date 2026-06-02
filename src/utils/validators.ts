import * as Yup from 'yup';

export const emailSchema = Yup.string().email('Email inválido').required('Obrigatório');
export const passwordSchema = Yup.string().min(6, 'Mínimo 6 caracteres').required('Obrigatório');
