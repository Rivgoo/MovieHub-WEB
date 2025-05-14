import apiClient from './client';
import { FavoriteExistsResponse } from './types/types.favorite';
const FAVORITES_BASE_URL = '/users/favorites'; 


export const addToFavoritesAPI = async (contentId: number | string): Promise<void> => {
  try {
    await apiClient.post(`${FAVORITES_BASE_URL}/${contentId}`);
  } catch (error) {
    console.error(`Помилка додавання фільму ${contentId} в обране:`, error);
    throw error;
  }
};


export const removeFromFavoritesAPI = async (contentId: number | string): Promise<void> => {
  try {
    await apiClient.delete(`${FAVORITES_BASE_URL}/${contentId}`);
  } catch (error) {
    console.error(`Помилка видалення фільму ${contentId} з обраного:`, error);
    throw error;
  }
};

export const checkIfFavoriteAPI = async (contentId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<FavoriteExistsResponse>(`${FAVORITES_BASE_URL}/${contentId}/exists`);
    return response.data.exists;
  } catch (error: any) {
    
    if (error.response && error.response.status === 404) {
      return false;
    }
    
    console.error(`Помилка перевірки статусу обраного для фільму ${contentId}:`, error);
    return false; 
               
  }
};