import * as yup from 'yup';

export const usuarioSchema = yup.object({
  body: yup.object({
    nombre: yup.string().required('Nombre es requerido'),
    email: yup.string().email('Email inválido').required('Email es requerido'),
    password: yup.string().min(6, 'Password debe tener al menos 6 caracteres').required('Password es requerido'),
    rol: yup.string().oneOf(['tecnico', 'coordinador'], 'Rol debe ser tecnico o coordinador').required('Rol es requerido')
  })
});