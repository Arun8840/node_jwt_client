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


