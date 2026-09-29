"use client"
import { useUserMutations } from '@/service/mutations';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from '../toast';

export default function UserButton() {
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
    <Avatar>
     <AvatarImage src="https://github.com/shadcn.png" />
     <AvatarFallback>CN</AvatarFallback>
    </Avatar>
   </DropdownMenuTrigger>
   <DropdownMenuContent>
    <DropdownMenuGroup>
     <DropdownMenuLabel>My Account</DropdownMenuLabel>
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