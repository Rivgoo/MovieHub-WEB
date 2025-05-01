export type ApiGenreResponse =
  | { status: 200; data: SuccessResponse[] }
  | { status: 401 | 403; data: ErrorResponse };

export interface SuccessResponse {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}
