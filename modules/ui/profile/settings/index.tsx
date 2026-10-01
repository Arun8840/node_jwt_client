"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileReponse } from '@/types';
import { ShieldCheck, Sun, User } from 'lucide-react';
import GeneralSettings from './general';
import SecuritySettings from './security';
import ThemeSettings from './theme';

interface SettingsProps {
  user: ProfileReponse
}

export default function Settings({ user }: SettingsProps) {
  return (
    <Tabs defaultValue="general" className='w-full'>
      <TabsList className='w-full'>
        <TabsTrigger value="general">
          <User /> General
        </TabsTrigger>
        <TabsTrigger value="security">
          <ShieldCheck /> Security
        </TabsTrigger>
        <TabsTrigger value="theme">
          <Sun /> Theme
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general" keepMounted>
        <GeneralSettings user={user} />
      </TabsContent>
      <TabsContent value="security" keepMounted>
        <SecuritySettings user={user} />
      </TabsContent>
      <TabsContent value="theme" keepMounted>
        <ThemeSettings />
      </TabsContent>
    </Tabs>
  );
}
