"use client"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export default function ThemeSettings() {
  const { setTheme, resolvedTheme } = useTheme()
  // next-themes has no theme on the server, so the switch only renders once hydrated
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  const handleDarkMode = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  }

  return (
    <div className='p-1'>
    <FieldSet>
     <FieldLabel>Theme Preferences</FieldLabel>
     <FieldDescription>
      Automatically switch between light and dark mode based on your system preferences.
     </FieldDescription>
     <FieldGroup data-slot="theme-group">
      <Field orientation="horizontal">
       <FieldLabel htmlFor="dark-mode" className="font-normal">
        Dark Mode
       </FieldLabel>
       <Switch
        id="dark-mode"
        disabled={!mounted}
        onCheckedChange={handleDarkMode}
        checked={mounted && resolvedTheme === 'dark'}
       />
      </Field>
     </FieldGroup>
    </FieldSet>
   </div>
  );
}
