import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/review';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export const fetchReviews = async (salonId: number): Promise<Review[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/${salonId}/reviews`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

