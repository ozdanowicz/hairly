import {Employee, Review, Schedule, Service} from './apiService';
import axios from 'axios';
export const BASE_URL = 'http://localhost:8080/api/v1';

export const fetchEmployeesBySalon = async (salonId: number): Promise<Employee[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/salon/${salonId}/employees`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  };

  export const fetchSalonReviews = async (salonId: number): Promise<Review[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/salon/${salonId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Failed to load reviews:", error);
      throw error;
    }
  };


  export const fetchSalonSchedule = async (salonId: number): Promise<Schedule[]> =>{
    try {
      const response = await axios.get(`${BASE_URL}/salon/${salonId}/schedule`);
      return response.data;
    } catch (error) {
      console.error("Failed to load salon schedule:", error);
      throw error; 
    }
  };

  export const fetchSalonServices = async (salonId: number): Promise<Service[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/salon/${salonId}/services`);
      return response.data;
    } catch (error) {
      console.error("Failed to load salon services:", error);
      throw error;
    }
  };

  export const createSalon = async (userId: number, createSalonData: { name: string; description: string }) => {
    try {
       await axios.post(`${BASE_URL}/salon/owner/${userId}`, createSalonData);
    } catch (error) {
        console.error('Failed to create salon:', error);
        throw error;
    }
  };