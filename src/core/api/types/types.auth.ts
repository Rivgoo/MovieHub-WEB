//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// POST /api/v1/auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}
