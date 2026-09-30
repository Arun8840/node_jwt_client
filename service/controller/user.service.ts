import {
  ConfirmMfaDTO,
  DisableMfaDTO,
  EnableMfaDTO,
  LoginSchemaDTO,
  RegisterSchemaDTO,
  ResetMfaDTO,
  VerifyMfaDTO,
} from "@/schema/user.schema"
import { publicApi } from "../apiClient"
import {
  ApiResponse,
  LoginResponse,
  MfaEnableResponse,
  MfaStatusResponse,
  MfaVerifyResponse,
  ProfileReponse,
} from "@/types"

const USERMANAGEMENT = "/users"

export const userServices = {
  login: async (req: LoginSchemaDTO) => {
    const { data } = await publicApi.post<ApiResponse<LoginResponse>>(
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
  },
  getMe: async () => {
    const { data } = await publicApi.get<ApiResponse<ProfileReponse>>(
    `${USERMANAGEMENT}/getme`,
  )
   return data
  },

  enableMfa: async (req: EnableMfaDTO) => {
    const { data } = await publicApi.post<ApiResponse<MfaEnableResponse>>(
      `${USERMANAGEMENT}/mfa/enable`,
      req,
    )
    return data
  },

  confirmMfa: async (req: ConfirmMfaDTO) => {
    const { data } = await publicApi.post<ApiResponse<MfaStatusResponse>>(
      `${USERMANAGEMENT}/mfa/enable/confirm`,
      req,
    )
    return data
  },

  disableMfa: async (req: DisableMfaDTO) => {
    const { data } = await publicApi.post<ApiResponse<MfaStatusResponse>>(
      `${USERMANAGEMENT}/mfa/disable`,
      req,
    )
    return data
  },

  verifyMfa: async (req: VerifyMfaDTO) => {
    const { data } = await publicApi.post<ApiResponse<MfaVerifyResponse>>(
      `${USERMANAGEMENT}/mfa/verify`,
      req,
    )
    return data
  },

  resetMfa: async (req: ResetMfaDTO) => {
    const { data } = await publicApi.post<ApiResponse<MfaStatusResponse>>(
      `${USERMANAGEMENT}/mfa/reset`,
      req,
    )
    return data
  },

}
