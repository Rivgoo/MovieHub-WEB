import apiClient from '../client.ts';
import {
  BookingFilterResponse,
  GetAllBookingsResponse,
  GetBookingByIdResponse,
  BookingExistenceResponse,
  SeatAvailabilityResponse,
  CreateBookingRequest,
  CreateBookingResponse,
} from '../types/types.booking.ts';

// GET /api/v1/bookings
export const getAllBookings = async (): Promise<GetAllBookingsResponse> => {
  const { data } = await apiClient.get<GetAllBookingsResponse>('/bookings');
  return data;
};

// GET /api/v1/bookings/{id}
export const getBookingById = async (
  id: number
): Promise<GetBookingByIdResponse> => {
  const { data } = await apiClient.get<GetBookingByIdResponse>(
    `/bookings/${id}`
  );
  return data;
};

// GET /api/v1/bookings/{id}/exists
export const checkBookingExists = async (id: number): Promise<boolean> => {
  const { data } = await apiClient.get<BookingExistenceResponse>(
    `/bookings/${id}/exists`
  );
  return data.exists;
};

// GET /api/v1/bookings/filter?query
export const searchBookings = async (
  query: string
): Promise<BookingFilterResponse> => {
  const { data } = await apiClient.get<BookingFilterResponse>(
    `/bookings/filter${query.startsWith('?') ? query : `?${query}`}`
  );
  return data;
};

// GET /api/v1/bookings/sessions/{sessionId}/seats/{rowNumber}/{seatNumber}/is-booked
export const checkSeatAvailability = async (
  sessionId: number,
  rowNumber: number,
  seatNumber: number
): Promise<boolean> => {
  const { data } = await apiClient.get<SeatAvailabilityResponse>(
    `/bookings/sessions/${sessionId}/seats/${rowNumber}/${seatNumber}/is-booked`
  );
  return data.isBooked;
};

// POST /api/v1/bookings
export const createBooking = async (
  payload: CreateBookingRequest
): Promise<CreateBookingResponse> => {
  const { data } = await apiClient.post<CreateBookingResponse>(
    '/bookings',
    payload
  );
  return data;
};

// DELETE /api/v1/bookings/{id}
export const deleteBooking = async (id: number): Promise<void> => {
  await apiClient.delete(`/bookings/${id}`);
};
