import apiClient from "../../core/api/client";
import { LoginRequest, LoginSuccessResponse } from "./types";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginSuccessResponse> => {
  try {
    const response = await apiClient.post<LoginSuccessResponse>(
      "/auth",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};
