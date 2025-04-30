import apiClient from "./client";

export interface UserInfoResponse {
  firstName: string;
  lastName: string;
  email: string;
}

const USER_INFO_SESSION_KEY = 'userInfoDataSession';

const fetchMyUserInfo = async (): Promise<UserInfoResponse> => {
    const response = await apiClient.get<UserInfoResponse>("/users/my-info");
    return response.data;
};

export const getMyUserInfo = async (): Promise<UserInfoResponse> => {
    const storedUserInfo = sessionStorage.getItem(USER_INFO_SESSION_KEY);
  
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo) as UserInfoResponse;

        if (parsedInfo && typeof parsedInfo.email === 'string') {
           return parsedInfo;
        } else {
          console.warn("UserAPI: Invalid user info format in sessionStorage. Clearing and fetching.");
          sessionStorage.removeItem(USER_INFO_SESSION_KEY);
        }
      } catch (parseError) {
        sessionStorage.removeItem(USER_INFO_SESSION_KEY);
      }
    }
  
    try {
      const data = await fetchMyUserInfo(); 
      sessionStorage.setItem(USER_INFO_SESSION_KEY, JSON.stringify(data));
      return data; 
    } catch (error) {
      console.error("UserAPI: Failed to fetch user info from API", error);

      throw error;
    }
  };
  
  export { USER_INFO_SESSION_KEY };