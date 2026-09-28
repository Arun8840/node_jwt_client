'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { loginSchema, LoginSchemaDTO } from '@/schema/user.schema';
import { useUserMutations } from '@/service/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';


export default function LoginModule() {
 const router = useRouter()
 const { login } = useUserMutations()
 const [showPassword, setShowPassword] = useState(false);
 const form = useForm<LoginSchemaDTO>({
  defaultValues: {
   email: '',
   password: '',
  },
  resolver: zodResolver(loginSchema),
 });

 const emailError = form.formState.errors.email;
 const passwordError = form.formState.errors.password;
 const isSubmitting = form.formState.isSubmitting || login.isPending


 const handleLogin: SubmitHandler<LoginSchemaDTO> = (data) => {
  login.mutate(data, {
   onSuccess(data) {
    toast.add({
     type: "success",
     description: data?.message
    })
    router.push("/")
   },
   onError: (error) => {
    toast.add({
     type: "error",
     description: error.message
    })

   }
  })
 }
 return (
  <div className='w-full'>
   <header className='mb-8 sm:mb-10'>
    <h1 className='text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#172033] sm:text-[2.75rem]'>
     Welcome back
    </h1>
    <p className='mt-3 max-w-md text-[15px] leading-6 text-[#5F6B7A] sm:text-base'>
     Enter your details to continue to your account.
    </p>
   </header>

   <form onSubmit={form.handleSubmit(handleLogin)}>
    <FieldGroup className='gap-5'>
     <Field data-invalid={Boolean(emailError)} className='gap-2'>
      <FieldLabel htmlFor='login-email' className='text-sm font-medium text-[#344054]'>
       Email
      </FieldLabel>
      <FieldContent>
       <Input
        {...form.register('email')}
        id='login-email'
        type='email'
        inputMode='email'
        autoComplete='email'
        autoCapitalize='none'
        spellCheck={false}
        placeholder='you@example.com'
        aria-invalid={Boolean(emailError)}
        aria-describedby={emailError ? 'login-email-error' : undefined}
       />
      </FieldContent>
      {emailError && <FieldError id='login-email-error' errors={[emailError]} className='text-[#B42318]' />}
     </Field>

     <Field data-invalid={Boolean(passwordError)} className='gap-2'>
      <FieldLabel htmlFor='login-password' className='text-sm font-medium text-[#344054]'>
       Password
      </FieldLabel>
      <FieldContent className='relative'>
       <Input
        {...form.register('password')}
        id='login-password'
        type={showPassword ? 'text' : 'password'}
        autoComplete='current-password'
        placeholder='Enter your password'
        aria-invalid={Boolean(passwordError)}
        aria-describedby={passwordError ? 'login-password-error' : undefined}
       />
       <button
        type='button'
        onClick={() => setShowPassword((visible) => !visible)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-controls='login-password'
        aria-pressed={showPassword}
        className='absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center'
       >
        {showPassword ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
       </button>
      </FieldContent>
      {passwordError && (
       <FieldError id='login-password-error' errors={[passwordError]} className='text-[#B42318]' />
      )}
     </Field>
    </FieldGroup>

    <Button
     type='submit'
     size={"xl"}
     disabled={isSubmitting}
     className='mt-7 w-full rounded-xl bg-primary text-[15px] font-semibold text-white shadow-none hover:bg-primary/80 focus-visible:ring-[#155EEF]/25'
    >
     {isSubmitting ? <>
      <Spinner />
      Signing in
     </> : 'Sign in'}
    </Button>
   </form>

   <p className='mt-8 text-center text-sm text-[#5F6B7A]'>
    New here?{' '}
    <Link
     href='/auth/register'
     className='rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
    >
     Create an account
    </Link>
   </p>
  </div>
 );
}
