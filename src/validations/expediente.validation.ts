import * as yup from 'yup';

export const expedienteSchema = yup.object({
  body: yup.object({
    codigo: yup.string().required('Código es requerido'),
    descripcion: yup.string().required('Descripción es requerida')
  })
});

export const estadoExpedienteSchema = yup.object({
  body: yup.object({
    estado: yup.string().oneOf(['aprobado', 'rechazado'], 'Estado debe ser aprobado o rechazado').required('Estado es requerido'),
    justificacion: yup.string().when('estado', {
      is: 'rechazado',
      then: (schema) => schema.required('Justificación es requerida para rechazo'),
      otherwise: (schema) => schema.notRequired()
    })
  })
});