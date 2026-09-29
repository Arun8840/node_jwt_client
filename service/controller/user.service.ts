import { LoginSchemaDTO, RegisterSchemaDTO } from "@/schema/user.schema"
import { publicApi } from "../apiClient"
import { ApiResponse } from "@/types"

const USERMANAGEMENT = "/users"

export const userServices = {
 login: async (req: LoginSchemaDTO) => {
  const { data } = await publicApi.post<ApiResponse>(
   `${USERMANAGEMENT}/login`,
   req,
  )
  return data
 },

 logout: async () => {
  const { data } = await publicApi.post<ApiResponse>(
   `${USERMANAGEMENT}/logout`,
  )
  return data
 },
 register: async (req: RegisterSchemaDTO) => {
  const { confirmPassword, ...rest } = req
  const { data } = await publicApi.post<ApiResponse>(
   `${USERMANAGEMENT}/register`,
   rest,
  )
  return data
 },
 getUsers: async () => {
  const { data } = await publicApi.get<ApiResponse>(
   `${USERMANAGEMENT}`,
  )
  return data
 }
}
