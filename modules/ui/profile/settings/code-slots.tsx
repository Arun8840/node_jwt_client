"use client"
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Controller, type Control, type Path } from 'react-hook-form';

interface CodeSlotsProps<T extends { code: string }> {
  control: Control<T>
  name?: Path<T>
  maxLength?: number
}

export default function CodeSlots<T extends { code: string }>({ control, name = 'code' as Path<T>, maxLength = 6 }: CodeSlotsProps<T>) {
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
