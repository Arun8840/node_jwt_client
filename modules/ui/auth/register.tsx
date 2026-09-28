'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { registerSchema, RegisterSchemaDTO } from '@/schema/user.schema';
import { useUserMutations } from '@/service/mutations';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';



type PasswordField = 'password' | 'confirmPassword';

export default function RegisterModule() {
 const navigate = useRouter()
 const { register } = useUserMutations()
 const [visiblePasswords, setVisiblePasswords] = useState<Record<PasswordField, boolean>>({
  password: false,
  confirmPassword: false,
 });
 const form = useForm<RegisterSchemaDTO>({
  defaultValues: {
   name: '',
   email: '',
   password: '',
   confirmPassword: '',
  },
  resolver: zodResolver(registerSchema),
 });

 const nameError = form.formState.errors.name;
 const emailError = form.formState.errors.email;
 const passwordError = form.formState.errors.password;
 const confirmPasswordError = form.formState.errors.confirmPassword;
 const isSubmitting = form.formState.isSubmitting || register.isPending

 const togglePassword = (field: PasswordField) => {
  setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
 };

 const handleRegister: SubmitHandler<RegisterSchemaDTO> = (data) => {
  register.mutate(data, {
   onSuccess: (res) => {
    toast.add({
     type: "success",
     description: res.message
    })
    navigate.push("/auth/login")
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
   <header className='mb-8 sm:mb-9'>
    <h1 className='text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[#172033] sm:text-[2.75rem]'>
     Create your account
    </h1>
    <p className='mt-3 max-w-md text-[15px] leading-6 text-[#5F6B7A] sm:text-base'>
     Enter your details to get started.
    </p>
   </header>

   <form onSubmit={form.handleSubmit(handleRegister)} noValidate className='flex flex-col gap-4'>
    <FieldGroup className='gap-5'>
     <Field data-invalid={Boolean(nameError)} className='gap-2'>
      <FieldLabel htmlFor='register-name' className='text-sm font-medium text-[#344054]'>
       Full name
      </FieldLabel>
      <FieldContent>
       <Input
        {...form.register('name')}
        id='register-name'
        type='text'
        autoComplete='name'
        autoCapitalize='words'
        placeholder='Your full name'
        aria-invalid={Boolean(nameError)}
        aria-describedby={nameError ? 'register-name-error' : undefined}
       />
      </FieldContent>
      {nameError && <FieldError id='register-name-error' errors={[nameError]} className='text-[#B42318]' />}
     </Field>

     <Field data-invalid={Boolean(emailError)} className='gap-2'>
      <FieldLabel htmlFor='register-email' className='text-sm font-medium text-[#344054]'>
       Email
      </FieldLabel>
      <FieldContent>
       <Input
        {...form.register('email')}
        id='register-email'
        type='email'
        inputMode='email'
        autoComplete='email'
        autoCapitalize='none'
        spellCheck={false}
        placeholder='you@example.com'
        aria-invalid={Boolean(emailError)}
        aria-describedby={emailError ? 'register-email-error' : undefined}
       />
      </FieldContent>
      {emailError && <FieldError id='register-email-error' errors={[emailError]} className='text-[#B42318]' />}
     </Field>

     <Field data-invalid={Boolean(passwordError)} className='gap-2'>
      <FieldLabel htmlFor='register-password' className='text-sm font-medium text-[#344054]'>
       Password
      </FieldLabel>
      <FieldContent className='relative'>
       <Input
        {...form.register('password')}
        id='register-password'
        type={visiblePasswords.password ? 'text' : 'password'}
        autoComplete='new-password'
        placeholder='At least 8 characters'
        aria-invalid={Boolean(passwordError)}
        aria-describedby={
         passwordError ? 'register-password-hint register-password-error' : 'register-password-hint'
        }
       />
       <button
        type='button'
        onClick={() => togglePassword('password')}
        aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}
        aria-controls='register-password'
        aria-pressed={visiblePasswords.password}
        className='absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F2F4F7] hover:text-[#172033] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15'
       >
        {visiblePasswords.password ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
       </button>
      </FieldContent>
      <p id='register-password-hint' className='text-xs leading-5 text-[#667085]'>
       Use at least 8 characters.
      </p>
      {passwordError && (
       <FieldError id='register-password-error' errors={[passwordError]} className='text-[#B42318]' />
      )}
     </Field>

     <Field data-invalid={Boolean(confirmPasswordError)} className='gap-2'>
      <FieldLabel htmlFor='register-confirm-password' className='text-sm font-medium text-[#344054]'>
       Confirm password
      </FieldLabel>
      <FieldContent className='relative'>
       <Input
        {...form.register('confirmPassword')}
        id='register-confirm-password'
        type={visiblePasswords.confirmPassword ? 'text' : 'password'}
        autoComplete='new-password'
        placeholder='Enter it again'
        aria-invalid={Boolean(confirmPasswordError)}
        aria-describedby={confirmPasswordError ? 'register-confirm-password-error' : undefined}
       />
       <button
        type='button'
        onClick={() => togglePassword('confirmPassword')}
        aria-label={visiblePasswords.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
        aria-controls='register-confirm-password'
        aria-pressed={visiblePasswords.confirmPassword}
        className='absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F2F4F7] hover:text-[#172033] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15'
       >
        {visiblePasswords.confirmPassword ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
       </button>
      </FieldContent>
      {confirmPasswordError && (
       <FieldError
        id='register-confirm-password-error'
        errors={[confirmPasswordError]}
        className='text-[#B42318]'
       />
      )}
     </Field>
    </FieldGroup>

    <Button
     type='submit'
     size={"xl"}
     disabled={isSubmitting}
     className={"w-full"}
    >
     {isSubmitting ? <>
      <Spinner />
      Creating account
     </> : 'Create account'}
    </Button>
   </form>

   <p className='mt-8 text-center text-sm text-[#5F6B7A]'>
    Already have an account?{' '}
    <Link
     href='/auth/login'
     className='rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
    >
     Sign in
    </Link>
   </p>
  </div>
 );
}
