import apiClient from "../client";
import { LoginRequest, LoginResponse } from "../types/types.auth";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
