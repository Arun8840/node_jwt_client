"use client"
import { useUserMutations } from '@/service/mutations';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from '../toast';
import { useGetMe } from '@/service/queries';
import { LoadingState } from './loading-state';
import { ErrorState } from './error-state';

export default function UserButton() {
 const { data, isLoading, isError, error } = useGetMe()
 const { logout } = useUserMutations()
 const navigation = useRouter()

 const handleLogout = () => {
  logout.mutate(undefined, {
   onSuccess: () => {
    toast.add({
     type: "success",
     description: "Logged out successfully"
    })
    navigation.push("/auth/login")
   },
   onError: () => {
    toast.add({
     type: "error",
     description: "Failed to log out"
    })
   }
  })
 }

 const loggedUser = data?.data
 if (isLoading) {
  return <LoadingState />
 }

 if (isError) {
  return <ErrorState message={error?.message} />
 }
 return (
  <DropdownMenu>
   <DropdownMenuTrigger disabled={logout.isPending} className='rounded-full'>
    <Avatar>
     <AvatarImage src="https://github.com/shadcn.png" />
     <AvatarFallback>
      {loggedUser?.name?.charAt(0).toUpperCase() || "UT"}
     </AvatarFallback>
    </Avatar>
   </DropdownMenuTrigger>
   <DropdownMenuContent>
    <DropdownMenuGroup>
     <DropdownMenuLabel>{loggedUser?.email || "My Account"}</DropdownMenuLabel>
     <DropdownMenuItem>Profile</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
     <DropdownMenuItem variant='destructive' onClick={handleLogout}>Logout</DropdownMenuItem>
    </DropdownMenuGroup>
   </DropdownMenuContent>
  </DropdownMenu>
 );
}