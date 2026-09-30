"use client"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ProfileReponse } from '@/types';

export default function GeneralSettings({ user }: { user: ProfileReponse }) {
  return (
    <div className='w-full flex flex-col gap-4 pt-2'>
      <FieldSet>
        <FieldLabel>Account</FieldLabel>
        <FieldDescription>
          Information tied to your account. Ask an administrator to change any of these values.
        </FieldDescription>
        <FieldGroup data-slot="account-group">
          <Field className='gap-2'>
            <FieldLabel htmlFor='account-name'>Name</FieldLabel>
            <FieldContent>
              <Input id='account-name' value={user?.name ?? ''} readOnly />
            </FieldContent>
          </Field>
          <Field className='gap-2'>
            <FieldLabel htmlFor='account-email'>Email</FieldLabel>
            <FieldContent>
              <Input id='account-email' value={user?.email ?? ''} readOnly />
            </FieldContent>
          </Field>
          <Field className='gap-2'>
            <FieldLabel htmlFor='account-role'>Role</FieldLabel>
            <FieldContent>
              <Input id='account-role' value={user?.role ?? ''} readOnly className='capitalize' />
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
