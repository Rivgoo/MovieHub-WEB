//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// GET /api/v1/users/{id}/exists
export interface UserExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/users/{id}/info
export interface UserInfoResponse {
  firstName: string;
  lastName: string;
  email: string;
}
//-----------------------------------------------------------

// POST /api/v1/users/admins/register
// POST /api/v1/users/customer/register
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterUserResponse {
  id: string;
}
//-----------------------------------------------------------
