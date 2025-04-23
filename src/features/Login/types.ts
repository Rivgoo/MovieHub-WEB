export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  accessToken: string;
}
