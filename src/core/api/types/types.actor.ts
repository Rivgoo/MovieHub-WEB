//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export interface ActorDto {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}


export interface DetailedActorInContentResponse extends ActorDto {
  roleName?: string | null;
}


export interface ActorInContentDto {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl: string;
  roleName: string;
}

// GET /api/v1/actors/filter
export interface ActorFilterResponse {
  items: ActorDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

export type ActorWithFullName = {
  id: number;
  fullName?: string;
  firstName?: string; // зробіть необов'язковим
  lastName?: string;
  RoleName?: string | null; // Зробіть необов'язковим і допускайте null
};

// GET /api/v1/actors
export type GetAllActorsResponse = ActorDto[];
//-----------------------------------------------------------

// GET /api/v1/actors/{id}
export type GetActorByIdResponse = ActorDto;
//-----------------------------------------------------------

// GET /api/v1/actors/{id}/exists
export interface ActorExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// POST /api/v1/actors
export interface CreateActorRequest {
  firstName: string;
  lastName: string;
}

export interface CreateActorResponse {
  id: number;
}
//-----------------------------------------------------------

// POST /api/v1/actors/{id}/photo
export interface UploadActorPhotoRequest {
  base64Image: string;
}

export interface UploadActorPhotoResponse {
  photoUrl: string;
}
//-----------------------------------------------------------

// PUT /api/v1/actors/{id}
export interface UpdateActorRequest {
  firstName: string;
  lastName: string;
}

export interface ActorRoleResponse {
  role: string;
}

export interface ActorInContentResponse {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  roleName?: string | null;
}


export type UpdateActorResponse = void;
