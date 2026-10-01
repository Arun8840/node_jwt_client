import z from "zod";


export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaDTO = z.infer<typeof loginSchema>;
export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  password: z.string().min(3, "Password is required"),
  email: z.string().email("Invalid email"),
  confirmPassword: z.string().min(3, "Confirm Password is required"),
})
  .refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })

export type RegisterSchemaDTO = z.infer<typeof registerSchema>

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  password: z.string().min(3, "Password is required"),
  email: z.string().email("Invalid email"),
  confirmPassword: z.string().min(3, "Confirm Password is required"),
})
  .refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })

export type UpdateUserSchemaDTO = z.infer<typeof updateUserSchema>

const totpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app');

export const enableMfaSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type EnableMfaDTO = z.infer<typeof enableMfaSchema>

export const confirmMfaSchema = z.object({
  code: totpCodeSchema,
});

export type ConfirmMfaDTO = z.infer<typeof confirmMfaSchema>

export const verifyMfaSchema = z.object({
  code: z.string().trim().min(1, 'Enter a verification code or a recovery code'),
});

export type VerifyMfaDTO = z.infer<typeof verifyMfaSchema>

export const disableMfaSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: totpCodeSchema,
});

export type DisableMfaDTO = z.infer<typeof disableMfaSchema>

export const resetMfaSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ResetMfaDTO = z.infer<typeof resetMfaSchema>


