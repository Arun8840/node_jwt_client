import { queryOptions, useQuery } from "@tanstack/react-query";
import { userKeys } from "../keys/user.keys";
import { userServices } from "../controller/user.service";



const userQueries = {
 getUsers: queryOptions({
  queryKey: userKeys.getUsers,
  queryFn: () => userServices.getUsers()
 }),

 getMe: queryOptions({
  queryKey: userKeys.getMe,
  queryFn: () => userServices.getMe()
 })
}


export const useGetUsers = () => useQuery(userQueries.getUsers);
export const useGetMe = () => useQuery(userQueries.getMe);