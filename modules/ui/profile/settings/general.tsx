"use client"
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { updateUserSchema, UpdateUserSchemaDTO } from '@/schema/user.schema';
import { useUserMutations } from '@/service/mutations';
import { ProfileReponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Undo2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type PasswordField = 'password' | 'confirmPassword';

const toastHandler = (message: string, type: "success" | "error") => {
  return toast.add({
    type,
    description: message,
    title: type
  })
}

export default function GeneralSettings({ user }: { user: ProfileReponse }) {
  const { updateUser } = useUserMutations()
  const [visiblePasswords, setVisiblePasswords] = useState<Record<PasswordField, boolean>>({
    password: false,
    confirmPassword: false,
  });

  // keep the inputs in sync when the profile query refetches after a successful update
  const serverValues = useMemo<UpdateUserSchemaDTO>(() => ({
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: '',
  }), [user.name, user.email]);

  const form = useForm<UpdateUserSchemaDTO>({
    defaultValues: serverValues,
    values: serverValues,
    resolver: zodResolver(updateUserSchema)
  })

  const nameError = form.formState.errors.name;
  const emailError = form.formState.errors.email;
  const passwordError = form.formState.errors.password;
  const confirmPasswordError = form.formState.errors.confirmPassword;
  const isSubmitting = form.formState.isSubmitting || updateUser.isPending

  const togglePassword = (field: PasswordField) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const handleUpdate: SubmitHandler<UpdateUserSchemaDTO> = (data) => {
    updateUser.mutate({ req: data, userId: user._id }, {
      onSuccess: (res) => {
        form.resetField('password')
        form.resetField('confirmPassword')
        toastHandler(res?.message, "success")
      },
      onError: (error) => toastHandler(error?.message, "error")
    })
  }

  return (
    <form className='w-full flex flex-col gap-4 pt-2' onSubmit={form.handleSubmit(handleUpdate)} noValidate>
      <FieldSet>
        <FieldLabel>Account</FieldLabel>
        <FieldDescription>
          Information tied to your account. Ask an administrator to change any of these values.
        </FieldDescription>
        <FieldGroup data-slot="account-group">
          <Field data-invalid={Boolean(nameError)} className='gap-2'>
            <FieldLabel htmlFor='account-name' className='text-sm font-medium text-[#344054]'>Name</FieldLabel>
            <FieldContent>
              <Input
                {...form.register('name')}
                id='account-name'
                type='text'
                autoComplete='name'
                autoCapitalize='words'
                placeholder='Name'
                aria-invalid={Boolean(nameError)}
                aria-describedby={nameError ? 'account-name-error' : undefined}
              />
            </FieldContent>
            {nameError && <FieldError id='account-name-error' errors={[nameError]} className='text-[#B42318]' />}
          </Field>

          <Field data-invalid={Boolean(emailError)} className='gap-2'>
            <FieldLabel htmlFor='account-email' className='text-sm font-medium text-[#344054]'>Email</FieldLabel>
            <FieldContent>
              <Input
                {...form.register('email')}
                id='account-email'
                type='email'
                inputMode='email'
                autoComplete='email'
                autoCapitalize='none'
                spellCheck={false}
                placeholder='you@example.com'
                aria-invalid={Boolean(emailError)}
                aria-describedby={emailError ? 'account-email-error' : undefined}
              />
            </FieldContent>
            {emailError && <FieldError id='account-email-error' errors={[emailError]} className='text-[#B42318]' />}
          </Field>

          <Field data-invalid={Boolean(passwordError)} className='gap-2'>
            <FieldLabel htmlFor='account-password' className='text-sm font-medium text-[#344054]'>Password</FieldLabel>
            <FieldContent className='relative'>
              <Input
                {...form.register('password')}
                id='account-password'
                type={visiblePasswords.password ? 'text' : 'password'}
                autoComplete='new-password'
                placeholder='Password'
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'account-password-hint account-password-error' : 'account-password-hint'}
              />
              <button
                type='button'
                onClick={() => togglePassword('password')}
                aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}
                aria-controls='account-password'
                aria-pressed={visiblePasswords.password}
                className='absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F2F4F7] hover:text-[#172033] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15'
              >
                {visiblePasswords.password ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
              </button>
            </FieldContent>
            <FieldDescription id='account-password-hint'>
              Required to save any changes to this section.
            </FieldDescription>
            {passwordError && <FieldError id='account-password-error' errors={[passwordError]} className='text-[#B42318]' />}
          </Field>

          <Field data-invalid={Boolean(confirmPasswordError)} className='gap-2'>
            <FieldLabel htmlFor='account-confirm-password' className='text-sm font-medium text-[#344054]'>Confirm Password</FieldLabel>
            <FieldContent className='relative'>
              <Input
                {...form.register('confirmPassword')}
                id='account-confirm-password'
                type={visiblePasswords.confirmPassword ? 'text' : 'password'}
                autoComplete='new-password'
                placeholder='Confirm Password'
                aria-invalid={Boolean(confirmPasswordError)}
                aria-describedby={confirmPasswordError ? 'account-confirm-password-error' : undefined}
              />
              <button
                type='button'
                onClick={() => togglePassword('confirmPassword')}
                aria-label={visiblePasswords.confirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                aria-controls='account-confirm-password'
                aria-pressed={visiblePasswords.confirmPassword}
                className='absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center rounded-lg text-[#667085] hover:bg-[#F2F4F7] hover:text-[#172033] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15'
              >
                {visiblePasswords.confirmPassword ? <EyeOff aria-hidden='true' /> : <Eye aria-hidden='true' />}
              </button>
            </FieldContent>
            {confirmPasswordError && <FieldError id='account-confirm-password-error' errors={[confirmPasswordError]} className='text-[#B42318]' />}
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className='w-full flex gap-2 items-center justify-end'>
        <Button type='button' variant={"secondary"} disabled={isSubmitting} onClick={() => form.reset()}>
          <Undo2 /> Reset
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? <>
            <Spinner />
            Updating
          </> : 'Update Changes'}
        </Button>
      </div>
    </form>
  );
}
