export interface SessionUser {
  email: string,
  role: string,
  isMfaEnabled: boolean,
}

export interface LoginResponse extends SessionUser {
  // only present on the MFA branch, where no session cookies were issued and
  // the caller must follow up with /mfa/verify
  mfaRequired?: boolean,
}

export interface MfaEnableResponse {
  secret: string,
  qrCode: string,
  recoveryCodes: string[],
  isMfaEnabled: boolean,
  mfaPending: boolean,
}

export interface MfaStatusResponse {
  isMfaEnabled: boolean,
  mfaPending?: boolean,
}

export interface MfaVerifyResponse extends SessionUser {
  // only present when a recovery code was spent, in which case the server hands
  // over a freshly rotated set in the same response
  recoveryCodes?: string[],
}
