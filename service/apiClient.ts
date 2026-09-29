import { ApiResponse } from "@/types"
import axios from "axios"

export class ApiError extends Error {
  status?: number
  data?: unknown

  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<ApiResponse>(error)) {
    const body = error.response?.data
    return new ApiError(
      body?.message ?? error.message,
      error.response?.status,
      body?.data,
    )
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError("Something went wrong. Please try again.")
}

const CSRF_COOKIE = "csrf_token"
const CSRF_HEADER = "X-CSRF-Token"
const SAFE_METHODS = new Set(["get", "head", "options"])

// Cookies are scoped by domain and path, not by port, so a cookie set by the
// API on localhost:3000 is readable from the app on localhost:3001.
export const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined

  const row = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))

  if (!row) return undefined

  return decodeURIComponent(row.slice(name.length + 1))
}

// --- 1. Base Configuration ---
const publicConfig = {
  baseURL: process.env.NEXT_PUBLIC_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
}

export const publicApi = axios.create(publicConfig)

// The server issues the token into a readable cookie; the client echoes it back
// in a header on every state-changing request. Safe verbs need no token.
let csrfRequest: Promise<string> | null = null

export const ensureCsrfToken = (): Promise<string> => {
  // no custom request headers here: anything outside the CORS safelist forces
  // a preflight, and the server's allowlist deliberately stays narrow.
  // The server sets Cache-Control: no-store on the response instead.
  csrfRequest ??= publicApi
    .get<ApiResponse<{ token: string }>>(`/users/csrf-token`)
    .then(({ data }) => data.data?.token ?? readCookie(CSRF_COOKIE) ?? "")
    .catch((error) => {
      // let the next attempt retry instead of caching a rejected promise
      csrfRequest = null
      throw toApiError(error)
    })

  return csrfRequest
}

publicApi.interceptors.request.use(async (config) => {
  const method = (config.method ?? "get").toLowerCase()

  if (SAFE_METHODS.has(method)) return config

  // read fresh every time: login/register hand back a new token, so a cached
  // copy would go stale and the next request would fail with 403
  let token = readCookie(CSRF_COOKIE)

  if (!token) {
    token = await ensureCsrfToken()
  }

  if (token) {
    config.headers.set(CSRF_HEADER, token)
  }

  return config
})

publicApi.interceptors.response.use((response) => response, (error) =>
  Promise.reject(toApiError(error)),
)
