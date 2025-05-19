export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer'
}

export interface User {
  id: string;
  role: UserRole;
}

export interface DecodedToken {
  exp: number;
  sub?: string;
  role?: string;
}

export function isValidUserRole(role: any): role is UserRole {
  return Object.values(UserRole).includes(role);
}
