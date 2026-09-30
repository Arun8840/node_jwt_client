'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { verifyMfaSchema, VerifyMfaDTO } from '@/schema/user.schema';
import { useUserMutations } from '@/service/mutations';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';


export default function MfaVerifyModule() {
  const router = useRouter()
  const { verifyMfa } = useUserMutations()
  const form = useForm<VerifyMfaDTO>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(verifyMfaSchema),
  });

  const codeError = form.formState.errors.code;
  const isVerifying = form.formState.isSubmitting || verifyMfa.isPending

  const handleVerify: SubmitHandler<VerifyMfaDTO> = (data) => {
    verifyMfa.mutate(data, {
      onSuccess(response) {
        toast.add({
          type: "success",
          description: response?.message
        })
        router.replace("/")
      },
      onError: (error) => {
        form.resetField('code')
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
          Verify it is you
        </h1>
        <p className='mt-3 max-w-md text-[15px] leading-6 text-[#5F6B7A] sm:text-base'>
          Enter the code from your authenticator app, or one of your recovery codes.
        </p>
      </header>

      <form onSubmit={form.handleSubmit(handleVerify)}>
        <FieldGroup className='gap-5'>
          <Field data-invalid={Boolean(codeError)} className='gap-2'>
            <FieldLabel htmlFor='mfa-code' className='text-sm font-medium text-[#344054]'>
              Verification code
            </FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name='code'
                render={({ field }) => (
                  <InputOTP
                    id='mfa-code'
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    autoComplete='one-time-code'
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </FieldContent>
            {codeError && <FieldError id='mfa-code-error' errors={[codeError]} className='text-[#B42318]' />}
          </Field>
        </FieldGroup>

        <Button
          type='submit'
          size={"xl"}
          disabled={isVerifying}
          className='mt-7 w-full rounded-xl bg-primary text-[15px] font-semibold text-white shadow-none hover:bg-primary/80 focus-visible:ring-[#155EEF]/25'
        >
          {isVerifying ? <>
            <Spinner />
            Verifying
          </> : <>
            <ShieldCheck aria-hidden='true' />
            Verify code
          </>}
        </Button>
      </form>

      <p className='mt-8 text-center text-sm text-[#5F6B7A]'>
        Wrong account?{' '}
        <Link
          href='/auth/login'
          className='rounded font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
        >
          Sign in again
        </Link>
      </p>
    </div>
  );
}