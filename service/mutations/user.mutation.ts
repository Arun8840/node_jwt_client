import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userKeys } from "../keys/user.keys"
import { userServices } from "../controller/user.service"
import {
  ConfirmMfaDTO,
  DisableMfaDTO,
  EnableMfaDTO,
  LoginSchemaDTO,
  RegisterSchemaDTO,
  ResetMfaDTO,
  VerifyMfaDTO,
} from "@/schema/user.schema"



export const useUserMutations = () => {
  const queryClient = useQueryClient()

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

  const enableMfa = useMutation({
    mutationKey: userKeys.enableMfa,
    mutationFn: (req: EnableMfaDTO) => userServices.enableMfa(req),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.getMe })
  })

  const confirmMfa = useMutation({
    mutationKey: userKeys.confirmMfa,
    mutationFn: (req: ConfirmMfaDTO) => userServices.confirmMfa(req),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.getMe })
  })

  const disableMfa = useMutation({
    mutationKey: userKeys.disableMfa,
    mutationFn: (req: DisableMfaDTO) => userServices.disableMfa(req),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.getMe })
  })

  const verifyMfa = useMutation({
    mutationKey: userKeys.verifyMfa,
    mutationFn: (req: VerifyMfaDTO) => userServices.verifyMfa(req),
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.getMe })
  })

  const resetMfa = useMutation({
    mutationKey: userKeys.resetMfa,
    mutationFn: (req: ResetMfaDTO) => userServices.resetMfa(req),
    retry: false,
    onSuccess: () => queryClient.removeQueries({ queryKey: userKeys.getMe })
  })


  return {
    login,
    register,
    logout,
    enableMfa,
    confirmMfa,
    disableMfa,
    verifyMfa,
    resetMfa
  }

}
