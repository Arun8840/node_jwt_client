"use client"
import { useUserMutations } from '@/service/mutations';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from '../toast';
import { ProfileReponse } from '@/types';

interface UserButtonProps {
 value: ProfileReponse
}

export default function UserButton({ value }: UserButtonProps) {

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
 return (
  <DropdownMenu>
   <DropdownMenuTrigger disabled={logout.isPending} className='rounded-full'>
    <Avatar size='lg'>
     <AvatarImage src="https://github.com/shadcn.png" />
     <AvatarFallback>
      {value?.name?.charAt(0).toUpperCase() || "UT"}
     </AvatarFallback>
    </Avatar>
   </DropdownMenuTrigger>
   <DropdownMenuContent>
    <DropdownMenuGroup>
     <DropdownMenuLabel>{value?.email || "My Account"}</DropdownMenuLabel>
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