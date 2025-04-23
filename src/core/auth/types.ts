export interface User {
  id: string;
  role: string;
}

export interface DecodedToken {
  exp: number;
  sub?: string;
  role?: string;
}
