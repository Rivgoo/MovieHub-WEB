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

// GET /api/v1/users/filter
export interface UserDto {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  userName: string | null;
  phoneNumber: string | null;
  emailConfirmed: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  roles: string[] | null;
}

export interface UserFilterResponse {
  items: UserDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// PUT /api/v1/users/{id}
export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
}
//-----------------------------------------------------------

// DELETE /api/v1/users/{id}
export type DeleteUserResponse = void;
//-----------------------------------------------------------

// GET /api/v1/users/roles
export interface RoleDto {
  id: string;
  name: string;
}

export type GetAllRolesResponse = RoleDto[];
//-----------------------------------------------------------