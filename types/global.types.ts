export interface ApiResponse<T = unknown> {
  status: string | number,
  message: string,
  data: T
}
