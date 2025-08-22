import * as yup from 'yup';

export const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().email('Email inválido').required('Email es requerido'),
    password: yup.string().required('Password es requerido')
  })
});