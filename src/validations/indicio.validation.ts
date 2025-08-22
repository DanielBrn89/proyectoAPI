import * as yup from 'yup';

export const indicioSchema = yup.object({
  body: yup.object({
    codigo: yup.string().required('Código es requerido'),
    descripcion: yup.string().required('Descripción es requerida'),
    peso: yup.number().min(0, 'Peso debe ser mayor o igual a 0').required('Peso es requerido'),
    color: yup.string().required('Color es requerido'),
    tamano: yup.string().required('Tamaño es requerido')
  })
});