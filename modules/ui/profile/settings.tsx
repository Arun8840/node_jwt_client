"use client"
import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { confirmMfaSchema, disableMfaSchema, enableMfaSchema } from '@/schema/user.schema';
import { useUserMutations } from '@/service/mutations';
import { MfaEnableResponse } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, KeyRound, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useForm, Controller, type Control, type Path, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';


interface SettingsProps {
  mfaEnabled: boolean
  mfaPending: boolean
}

type EnableValues = z.infer<typeof enableMfaSchema>
type ConfirmValues = z.infer<typeof confirmMfaSchema>
type DisableValues = z.infer<typeof disableMfaSchema>

const toastHanlder = (message: string, type: "success" | "error") => {
  return toast.add({
    type,
    description: message,
    title: type
  })
}

function CodeSlots<T extends { code: string }>({ control, name = 'code' as Path<T>, maxLength = 6 }: { control: Control<T>, name?: Path<T>, maxLength?: number }) {
  const slots = Array.from({ length: maxLength }, (_, index) => index)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <InputOTP maxLength={maxLength} value={field.value} onChange={field.onChange}>
          <InputOTPGroup>
            {slots.map((index) => <InputOTPSlot key={index} index={index} />)}
          </InputOTPGroup>
        </InputOTP>
      )}
    />
  )
}

export default function Settings({ mfaEnabled, mfaPending }: SettingsProps) {
  const { enableMfa, confirmMfa, disableMfa } = useUserMutations()
  const [enrollment, setEnrollment] = useState<MfaEnableResponse | null>(null)
  const [requestingDisable, setRequestingDisable] = useState(false)

  const isPending = enableMfa.isPending || confirmMfa.isPending || disableMfa.isPending

  const enableForm = useForm<EnableValues>({
    defaultValues: { password: '' },
    resolver: zodResolver(enableMfaSchema),
  })

  const confirmForm = useForm<ConfirmValues>({
    defaultValues: { code: '' },
    resolver: zodResolver(confirmMfaSchema),
  })

  const disableForm = useForm<DisableValues>({
    defaultValues: { password: '', code: '' },
    resolver: zodResolver(disableMfaSchema),
  })

  const passwordError = requestingDisable
    ? disableForm.formState.errors.password
    : enableForm.formState.errors.password
  const disableCodeError = disableForm.formState.errors.code
  const confirmCodeError = confirmForm.formState.errors.code

  const handleSwitch = (checked: boolean) => {
    setRequestingDisable(!checked)
    if (checked) {
      enableForm.reset()
    } else {
      disableForm.reset()
    }
  }

  const startEnroll: SubmitHandler<EnableValues> = (values) => {
    enableMfa.mutate(values, {
      onSuccess: (data) => {
        setEnrollment(data?.data ?? null)
        toastHanlder(data?.message, "success")
      },
      onError: (error) => toastHanlder(error?.message, "error")
    })
  }

  const finishEnroll: SubmitHandler<ConfirmValues> = (values) => {
    confirmMfa.mutate(values, {
      onSuccess: (data) => {
        setEnrollment(null)
        confirmForm.reset()
        toastHanlder(data?.message, "success")
      },
      onError: (error) => toastHanlder(error?.message, "error")
    })
  }

  const regenerate = () => {
    const { password } = enableForm.getValues()
    enableMfa.mutate({ password }, {
      onSuccess: (data) => {
        setEnrollment(data?.data ?? null)
        confirmForm.reset()
        toastHanlder(data?.message, "success")
      },
      onError: (error) => toastHanlder(error?.message, "error")
    })
  }

  const stopEnroll = () => {
    setEnrollment(null)
    confirmForm.reset()
  }

  const cancelDisable = () => {
    setRequestingDisable(false)
    disableForm.reset()
  }

  const finishDisable: SubmitHandler<DisableValues> = (values) => {
    disableMfa.mutate(values, {
      onSuccess: (data) => {
        setRequestingDisable(false)
        disableForm.reset()
        toastHanlder(data?.message, "success")
      },
      onError: (error) => toastHanlder(error?.message, "error")
    })
  }

  const copyAll = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toastHanlder("Copied to clipboard", "success")
    } catch {
      toastHanlder("Could not copy to clipboard", "error")
    }
  }

  return (
    <div className='w-full flex flex-col gap-4'>
      <FieldSet>
        <FieldLabel>MFA Authentication</FieldLabel>
        <FieldDescription>
          {mfaEnabled
            ? 'Two-factor authentication is active on this account.'
            : 'Add an authenticator app as a second factor. You will need a recovery code if you lose the device.'}
        </FieldDescription>
        <FieldGroup data-slot="auth-group">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="enable-mfa" className="font-normal">
              Enable
            </FieldLabel>
            <Switch
              disabled={isPending}
              id="enable-mfa"
              checked={mfaEnabled}
              onCheckedChange={handleSwitch}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      {requestingDisable && !mfaEnabled && <form onSubmit={disableForm.handleSubmit(finishDisable)}>
        <FieldSet>
          <FieldGroup className='gap-4'>
            <div className='flex items-start gap-2 rounded-lg bg-[#FFFAEB] p-3 text-sm text-[#B54708]'>
              <TriangleAlert className='size-4 shrink-0 mt-0.5' />
              <span>Disabling MFA signs you out everywhere and asks you to set it up again.</span>
            </div>
            <Field data-invalid={Boolean(passwordError)} className='gap-2'>
              <FieldLabel htmlFor='disable-mfa-password'>Password</FieldLabel>
              <FieldContent>
                <Input {...disableForm.register('password')} id='disable-mfa-password' type='password' autoComplete='current-password' />
              </FieldContent>
              {passwordError && <FieldError errors={[passwordError]} />}
            </Field>
            <Field data-invalid={Boolean(disableCodeError)} className='gap-2'>
              <FieldLabel>Authenticator code</FieldLabel>
              <FieldContent>
                <div className='w-fit'>
                  <CodeSlots control={disableForm.control} name={'code'} />
                </div>
              </FieldContent>
              {disableCodeError && <FieldError errors={[disableCodeError]} />}
            </Field>
          </FieldGroup>
          <div className='grid grid-cols-2 gap-2'>
            <Button type='button' variant={"secondary"} disabled={isPending} onClick={cancelDisable}>
              Cancel
            </Button>
            <Button type='submit' variant={"destructive"} disabled={isPending}>
              {disableMfa.isPending ? 'Disabling' : 'Disable MFA'}
            </Button>
          </div>
        </FieldSet>
      </form>}

      {!mfaEnabled && !requestingDisable && !enrollment && <form onSubmit={enableForm.handleSubmit(startEnroll)}>
        <FieldSet>
          <FieldGroup className='gap-4'>
            <Field data-invalid={Boolean(passwordError)} className='gap-2'>
              <FieldLabel htmlFor='enable-mfa-password'>Password</FieldLabel>
              <FieldContent>
                <Input {...enableForm.register('password')} id='enable-mfa-password' type='password' autoComplete='current-password' />
              </FieldContent>
              <FieldDescription>Confirm your password before enrolling a new device.</FieldDescription>
              {passwordError && <FieldError errors={[passwordError]} />}
            </Field>
          </FieldGroup>
          <Button type='submit' disabled={isPending} className='w-full'>
            <KeyRound /> {enableMfa.isPending ? 'Generating secret' : 'Continue'}
          </Button>
        </FieldSet>
      </form>}

      {enrollment && <FieldSet>
        <FieldGroup className='gap-4'>
          <div className='size-46 mx-auto'>
            <img src={enrollment.qrCode} alt='MFA QR code' className='w-full h-full' />
          </div>

          <Field>
            <FieldLabel>Setup key</FieldLabel>
            <FieldDescription>Prefer to type it in? Enter this key in your authenticator app.</FieldDescription>
            <div className='flex items-center gap-2'>
              <code className='flex-1 rounded-md bg-[#F8FAFC] px-3 py-2 font-mono text-sm break-all'>{enrollment.secret}</code>
              <Button type='button' variant={"secondary"} size={"icon"} aria-label='Copy setup key' onClick={() => copyAll(enrollment.secret)}>
                <Copy />
              </Button>
            </div>
          </Field>

          <Field>
            <FieldLabel>Recovery codes</FieldLabel>
            <FieldDescription>Each code works once. They are shown now and never again.</FieldDescription>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-1 rounded-md bg-[#F8FAFC] p-3 font-mono text-xs'>
              {enrollment.recoveryCodes.map((code) => <li key={code}>{code}</li>)}
            </ul>
            <Button type='button' variant={"secondary"} onClick={() => copyAll(enrollment.recoveryCodes.join('\n'))}>
              <Copy /> Copy recovery codes
            </Button>
          </Field>

          <form onSubmit={confirmForm.handleSubmit(finishEnroll)}>
            <FieldGroup className='gap-4'>
              <Field data-invalid={Boolean(confirmCodeError)} className='gap-2'>
                <FieldLabel>Verify your authenticator</FieldLabel>
                <FieldContent>
                  <div className='w-fit'>
                    <CodeSlots control={confirmForm.control} name={'code'} />
                  </div>
                </FieldContent>
                <FieldDescription>
                  Enter the 6-digit code from your authenticator app to finish enabling MFA.
                </FieldDescription>
                {confirmCodeError && <FieldError errors={[confirmCodeError]} />}
              </Field>
            </FieldGroup>
            <div className='grid grid-cols-2 gap-2'>
              <Button type='button' variant={"secondary"} disabled={isPending} onClick={regenerate}>
                <RotateCcw /> Re-generate
              </Button>
              <Button type='submit' disabled={isPending}>
                <ShieldCheck /> {confirmMfa.isPending ? 'Verifying' : 'Verify Code'}
              </Button>
            </div>
            <Button type='button' variant={"ghost"} className='w-full' disabled={isPending} onClick={stopEnroll}>
              Cancel
            </Button>
          </form>
        </FieldGroup>
      </FieldSet>}

      {mfaPending && !enrollment && !mfaEnabled && <div className='flex items-start gap-2 rounded-lg bg-[#EFF8FF] p-3 text-sm text-[#175CD3]'>
        <TriangleAlert className='size-4 shrink-0 mt-0.5' />
        <span>An enrollment is already in progress. Re-run setup to generate a new secret.</span>
      </div>}
    </div>
  );
}
