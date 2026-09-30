export interface ApiResponse<T = unknown> {
  status: string | number,
  message: string,
  data: T
}


export interface ProfileReponse {
  _id: string,
  name: string,
  email: string,
  role: string
}