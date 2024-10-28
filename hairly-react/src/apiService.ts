import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/api/v1';

export interface Location {
  street: string;
  buildingNumber: string;
  apartmentNumber?: string;
  latitude?: number;
  longitude?: number;
  city: string;
  province?: string;
  zipCode?: string;
}

export interface SalonImages {
  id: number;
  salonId: number;
  imageData: Uint8Array;
  contentType: string;
  filename: string;
}

export interface Service {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface SpecializationEnum {
  HAIRDRESSER: 'HAIRDRESSER',
  BARBER: 'BARBER',
  STYLIST: 'STYLIST',
  COLORIST: 'COLORIST',
  MAKEUP_ARTIST: 'MAKEUP_ARTIST',
}

export interface Specialization {
  id: number;
  employeeId: number;
  name: string;
}

export interface Schedule {
  id: number;
  employeeId: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

export interface Employee {
  id: number;
  userId: number;
  salonId: number;
}

export interface EmployeeDetails {
  id: number;
  userId: number;
  salonId: number;
  name: string;
  profilePicture: Uint8Array
  surname: string;
  email: string;
  specializations: Specialization[];
  createdAt: string;
}

export interface Review {
  id: string;
  salonName: string;
  rating: number;
  createdAt: string;
  comment: string;
}

export enum Role {
  CLIENT =  'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  OWNER = 'OWNER',
}

export interface Appointment {
  id: number;
  clientId: number;
  employeeId: number;
  serviceId: number;
  scheduledTime: string;
  status: string;
  createdAt: string;
}

export interface SalonSearchCriteria {
  city?: string;
  salonName?: string;
  popularity?: string;
  reviews?: string;
  latitude?: number;
  longitude?: number;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: Role;
  appointments_as_client: Appointment[];
  appointments_as_employee: Appointment[];
  createdAt: string;
}

export interface SalonRequest {
  name: string;
  description: string;
  location: Location;
  services: Service[];
}

export interface Salon {
  id: number;
  name: string;
  salonImages: SalonImages[];
  description: string;
  location: Location;
  employees: Employee;
  services: Service[];
  priceRange: [string, string];
  averageRating: number;
  reviewsCount: number;
}

export const createSalon = async (salonData: SalonRequest): Promise<SalonRequest> => {
  try {
    console.log(salonData);
    const response = await axios.post(`${BASE_URL}/salon`, salonData);
    return response.data;
  } catch (error) {
    console.error('Error creating salon:', error);
    throw error;
  }
};

export const convertToBase64 = (imageData: Uint8Array | string, contentType: string) => {
  if (typeof imageData === 'string') {
    return `data:${contentType};base64,${imageData}`;
  }
  const base64String = btoa(
    String.fromCharCode.apply(null, imageData)
  );
  return `data:${contentType};base64,${base64String}`;
};

export const fetchSalons = async (): Promise<Salon[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/salon/salons`);
    return response.data.content; 
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};

export const fetchUsers = async (userId: number): Promise<User> => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching salons:', error);
    throw error;
  }
};

export const fetchAppointments = async (userId: number): Promise<Appointment[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/appointment/${userId}/appointments`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const fetchServices = async (salonId: number): Promise<Service[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/salon/${salonId}/services`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const fetchEmployeeDetails = async (employeeId: number): Promise<EmployeeDetails> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}`);
    console.log("response data: " + response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee details:', error);
    throw error;
  }
};

export const fetchEmployeesBySalon = async (salonId: number): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/salon/${salonId}/employees`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchReviews = async (salonId: number): Promise<Review[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/review/${salonId}/reviews`);
    return response.data.content; 
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const fetchSalonDetails = async (salonId: number): Promise<Salon> => {
    try {
        const response = await axios.get(`${BASE_URL}/salon/${salonId}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching salon details:', error);
        throw error;
    }
}

export const fetchOwnerSalon = async (ownerId: number): Promise<Salon> => {
  try {
    const response = await axios.get(`${BASE_URL}/owner/${ownerId}/salon`);
    return response.data; 
  } catch (error) {
    console.error('Error fetching owner salon:', error);
    throw error;
  }
};


export const fetchSalonSchedule = async (salonId: number): Promise<Schedule[]> =>{
  try {
    const response = await axios.get(`${BASE_URL}/salon/${salonId}/schedule`);
    return response.data; // Return the appointments data
  } catch (error) {
    console.error("Failed to load salon schedule:", error);
    throw error; 
  }
};

export const fetchUserData = async (token: string): Promise<User> => {
  if (!token) {
      throw new Error('No authentication token found');
  }

  const response = await fetch('http://localhost:8080/api/v1/auth/user', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Correctly formatted
      },
  });

  if (!response.ok) {
      throw new Error('Failed to fetch user data: ' + response.statusText);
  }

  const userData: User = await response.json();
  return userData;
};


export const fetchClientAppointments = async (clientId: number): Promise<Appointment[]> =>{
  try {
    const response = await axios.get(`${BASE_URL}/client/${clientId}/appointments`);
    return response.data; // Return the appointments data
  } catch (error) {
    console.error("Failed to load client appointments:", error);
    throw error; 
  }
};

export const fetchClientReviews = async (clientId: number): Promise<Review[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/client/${clientId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Failed to load client reviews:", error);
    throw error; 
  }
};

export const fetchEmployeeAppointments = async (employeeId: number): Promise<Appointment[]> =>{
  try {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}/appointments`);
    return response.data; 
  } catch (error) {
    console.error("Failed to load employee appointments:", error);
    throw error; 
  }
};

export const fetchEmployeeSpecializations = async (employeeId: number): Promise<Specialization[]> =>{
  try {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}/specializations`);
    return response.data; 
  } catch (error) {
    console.error("Failed to load employee specializations:", error);
    throw error; 
  }
};

// Search salons by nearby location
export const fetchSalonsByLocation = async (latitude: number, longitude: number, radius: number): Promise<Salon[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/salon/nearby`, {
      params: { latitude, longitude, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching salons by location:', error);
    throw error;
  }
};

export const fetchSalonsByCriteria = async (searchQuery: SalonSearchCriteria) => {
  const params = new URLSearchParams();
  
  if (searchQuery.city) params.append('city', searchQuery.city);
if (searchQuery.salonName) params.append('salonName', searchQuery.salonName);
if (searchQuery.popularity) params.append('popularity', searchQuery.popularity);
if (searchQuery.reviews) params.append('reviews', searchQuery.reviews);
if (searchQuery.latitude !== undefined && searchQuery.latitude !== null) {
  params.append('latitude', searchQuery.latitude.toString());
}
if (searchQuery.longitude !== undefined && searchQuery.longitude !== null) {
  params.append('longitude', searchQuery.longitude.toString());
}

  
  const response = await axios.get(`${BASE_URL}/salon/search?${params.toString()}`);
  return response.data; // Assuming response.data contains the array of salons
};

export const fetchSalonsByCity = async (city: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/salon/search/city?city=${city}`);
        return response.data; // Return the salon data
    } catch (error) {
        console.error("Failed to load salons by city:", error);
        throw error; // Rethrow error or handle it accordingly
    }
};

// Example fetch function in apiService.ts
export const fetchSalonsByName = async (salonName: string) => {
  const response = await fetch(`${BASE_URL}/salon/search?name=${salonName}`);
  if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};