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

// --- 1. Base Configuration ---
const publicConfig = {
  baseURL: process.env.NEXT_PUBLIC_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
}

export const publicApi = axios.create(publicConfig)

publicApi.interceptors.response.use((response) => response, (error) =>
  Promise.reject(toApiError(error)),
)
