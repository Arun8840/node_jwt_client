"use client"
import { ErrorState } from "@/components/ui/custom/error-state";
import { LoadingState } from "@/components/ui/custom/loading-state";
import UserButton from "@/components/ui/custom/user-button";
import { useGetUsers } from "@/service/queries";

export default function Home() {
  const { isLoading, isError, error } = useGetUsers()

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
      <UserButton />
    </section>
  );
}
