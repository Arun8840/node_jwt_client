"use client"
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/custom/error-state";
import { LoadingState } from "@/components/ui/custom/loading-state";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUserMutations } from "@/service/mutations";
import { useGetUsers } from "@/service/queries";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { logout } = useUserMutations()
  const { isLoading, isError, error } = useGetUsers()

  const navigate = useRouter()
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.add({
          type: "success",
          description: "Logged out successfully"
        })
        navigate.push("/auth/login")
      },
      onError: () => {
        toast.add({
          type: "error",
          description: "Failed to log out"
        })
      }
    })
  }

  if (isLoading) {
    return <LoadingState />
  }
  if (isError) {
    return (
      <ErrorState
        message={error?.message}
      />
    )
  }

  return (
    <section className="flex justify-center items-center min-h-screen">
      <Button disabled={logout.isPending} onClick={handleLogout} variant={"destructive"}>
        {logout.isPending ? <Spinner /> : <LogOut />}  Log out
      </Button>
    </section>
  );
}
