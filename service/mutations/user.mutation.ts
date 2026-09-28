import { useMutation } from "@tanstack/react-query"
import { userKeys } from "../keys/user.keys"
import { userServices } from "../controller/user.service"
import { LoginSchemaDTO, RegisterSchemaDTO } from "@/schema/user.schema"



export const useUserMutations = () => {


  const login = useMutation({
    mutationKey: userKeys.login,
    mutationFn: (req: LoginSchemaDTO) => userServices.login(req),
    retry: false
  })

  const register = useMutation({
    mutationKey: userKeys.register,
    mutationFn: (req: RegisterSchemaDTO) => userServices.register(req),
    retry: false
  })

  const logout = useMutation({
    mutationKey: userKeys.logout,
    mutationFn: () => userServices.logout(),
    retry: false
  })


  return {
    login,
    register,
    logout
  }

}