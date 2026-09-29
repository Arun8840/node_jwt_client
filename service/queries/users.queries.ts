import { queryOptions, useQuery } from "@tanstack/react-query";
import { userKeys } from "../keys/user.keys";
import { userServices } from "../controller/user.service";



const userQueries = {
 getUsers: queryOptions({
  queryKey: userKeys.getUsers,
  queryFn: () => userServices.getUsers()
 })
}


export const useGetUsers = () => useQuery(userQueries.getUsers);