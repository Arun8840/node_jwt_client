"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Settings from './settings';
import UserButton from '@/components/ui/custom/user-button';
import { LoadingState } from '@/components/ui/custom/loading-state';
import { ErrorState } from '@/components/ui/custom/error-state';
import { useGetMe } from '@/service/queries';
import { ProfileReponse } from '@/types';

export default function ProfileRoot() {
 const { data, isLoading, isError, error } = useGetMe()
 const loggedUser = data?.data as ProfileReponse

 if (isLoading) {
  return <LoadingState />
 }

 if (isError) {
  return <ErrorState message={error?.message} />
 }
 return (
  <Card className='max-w-md w-full'>

   <CardHeader>
    <CardTitle className='space-y-4'>
     <UserButton value={loggedUser} />
     <h1>Profile Management</h1>
    </CardTitle>
    <CardDescription>Manage your profile and account settings</CardDescription>
   </CardHeader>
   <CardContent>
     <Settings mfaEnabled={loggedUser.isMfaEnabled} mfaPending={loggedUser.mfaPending} />

   </CardContent>
  </Card>
 );
}