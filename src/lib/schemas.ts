import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export const signupSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ['confirmPassword'],
});

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria.'),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo.'),
});

export const invoiceSchema = z.object({
  customerName: z.string().min(1, 'El nombre del cliente es obligatorio.'),
  customerEmail: z.string().email('Dirección de correo electrónico no válida.'),
  invoiceDate: z.date({ required_error: 'La fecha de la factura es obligatoria.' }),
  dueDate: z.date({ required_error: 'La fecha de vencimiento es obligatoria.' }),
  status: z.enum(['Paid', 'Pending', 'Overdue']),
  items: z.array(invoiceItemSchema).min(1, 'Se requiere al menos un artículo.'),
  notes: z.string().optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
