export interface ApiResponse<T = unknown> {
  success: boolean,
  message: string,
  data: T
}


export interface ProfileReponse {
  _id: string,
  name: string,
  email: string,
  role: string,
  isMfaEnabled: boolean,
  // true once /mfa/enable has issued a secret but /mfa/enable/confirm has not
  // been answered; the account is not actually protected while it is set
  mfaPending: boolean
}
