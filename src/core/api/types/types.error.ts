export interface ApiError {
  code: string | null;
  description: string | null;
  errorType: ApiErrorType;
}

export type ApiErrorType =
  | 'Failure'
  | 'NotFound'
  | 'BadRequest'
  | 'Conflict'
  | 'AccessUnAuthorized'
  | 'AccessForbidden'
  | 'InternalServerError';

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: any;
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>;
}
