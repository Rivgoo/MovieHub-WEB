//тип Request описує body (наприклад, CreateContentRequest).
//тип Response — успішну відповідь (наприклад, ContentDto або UploadPosterResponse).

// Templates
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface BookingDto {
  id: number;
  userId: string;
  sessionId: number;
  rowNumber: number;
  seatNumber: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}
//-----------------------------------------------------------

// GET /api/v1/bookings/filter
export interface BookingFilterResponse {
  items: BookingDto[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/bookings
export type GetAllBookingsResponse = BookingDto[];
//-----------------------------------------------------------

// GET /api/v1/bookings/{id}
export type GetBookingByIdResponse = BookingDto;
//-----------------------------------------------------------

// GET /api/v1/bookings/{id}/exists
export interface BookingExistenceResponse {
  exists: boolean;
}
//-----------------------------------------------------------

// GET /api/v1/bookings/sessions/{sessionId}/seats/{rowNumber}/{seatNumber}/is-booked
export interface SeatAvailabilityResponse {
  isBooked: boolean;
}
//-----------------------------------------------------------

// POST /api/v1/bookings
export interface CreateBookingRequest {
  sessionId: number;
  rowNumber: number;
  seatNumber: number;
}

export interface CreateBookingResponse {
  id: number;
}
//-----------------------------------------------------------

// DELETE /api/v1/bookings/{id}
export type DeleteBookingResponse = void;
