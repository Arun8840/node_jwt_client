import z from 'zod';

export const loginSchema = z.object({
 email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
 password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaDTO = z.infer<typeof loginSchema>;

export const registerSchema = z
 .object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm your password'),
 })
 .refine((values) => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
 });

export type RegisterSchemaDTO = z.infer<typeof registerSchema>;
