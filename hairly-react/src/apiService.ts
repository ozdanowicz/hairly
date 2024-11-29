import axios from 'axios';
import { LucideChevronRightCircle } from 'lucide-react';

export const BASE_URL = 'http://localhost:8080/api/v1';

export interface Location {
  id: number;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
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
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface EmployeeAppointment {
  scheduledTime: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  clientFullName: string;
  serviceName: string;
  servicePrice: number;
  serviceDurationMinutes: number;
}

export enum SpecializationEnum {
  HAIRDRESSER= 'HAIRDRESSER',
  BARBER= 'BARBER',
  STYLIST= 'STYLIST',
  COLORIST= 'COLORIST',
}

export enum DayOfWeek {
  MONDAY='MONDAY',
  TUESDAY= 'TUESDAY',
  WEDNESDAY= 'WEDNESDAY',
  THURSDAY= 'THURSDAY',
  FRIDAY= 'FRIDAY',
  SATURDAY= 'SATURDAY',
  SUNDAY= 'SUNDAY',
}

export interface Specialization {
  id: number;
  salonId: number;
  specialization: SpecializationEnum;
  services: Service[];
}

export interface Schedule {
  id: number;
  employeeId: number;
  salonId: number;
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
  type: ScheduleType;
}
export enum ScheduleType {
  SALON= 'SALON',
  EMPLOYEE= 'EMPLOYEE',
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
  scheduledDate: string;
  status: string;
  createdAt: string;
}

export enum AppointmentStatus {
  PENDING= 'PENDING',
  CONFIRMED= 'CONFIRMED',
  CANCELLED= 'CANCELLED',
  COMPLETED= 'COMPLETED',
}

export interface SalonSearchCriteria {
  city?: string;
  salonName?: string;
  popularity?: string;
  reviews?: string;
  latitude?: number;
  longitude?: number;
}

export interface UserUpdateForm {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: Role;
  // appointments_as_client: Appointment[];
  // appointments_as_employee: Appointment[];
  createdAt: string;
}

export interface SalonInfoRequest {
  name: string;
  description: string;
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
  specializations: Specialization[];
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


export const fetchEmployeeByUser = async (userId: number): Promise<Employee> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee by user:", error);
    throw error;
  }
}

export const fetchEmployeeSalon = async(employeeId: number): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}/salon`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee salon:", error);
    throw error;
  }
}

export async function fetchUserData(token: string): Promise<User> {
  if (!token) throw new Error('No authentication token found');

  const response = await fetch('http://localhost:8080/api/v1/auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Failed to fetch user data');

  const userData: User = await response.json();
  return userData;
}

// export const fetchSpecializationEnums = async (): Promise<SpecializationEnum[]> => {
//   const response = await axios.get<SpecializationEnum[]>(`${BASE_URL}/specialization/enums`);
//   return response.data;
// };

export const fetchSalonSpecializations = async (salonId: number): Promise<Specialization[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/salon/${salonId}/specializations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching salon specializations:', error);
    throw error;
  }
}

// Assign specialization to an employee
export const assignSpecializationToEmployee = async (employeeId: number, specializationIds: number[] = []) => {
  try {
    console.log("Assigning specializations to employee:", specializationIds);
    await axios.put(`${BASE_URL}/employee/${employeeId}/assign`, specializationIds); // Directly send the array
  } catch (error) {
    console.error("Error assigning specializations to employee:", error);
    throw error;
  }
};

export const addEmployeeToSalon = async (email: string, salonId: number): Promise<Employee> => {
  try {
    const response = await axios.post(`${BASE_URL}/employee/salon/${salonId}/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to add employee to salon:", error);
    throw error;
  }
}

export const doesUserWithEmailExists = async (email: string): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee by email:", error);
    throw error;
  }
}

export const deleteEmployeeFromSalon = async (employeeId: number): Promise<void> => {  
  try {
    await axios.delete(`${BASE_URL}/employee/${employeeId}`);
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw error;
  }
}


export const removeSpecializationFromEmployee = async (employeeId: number, specializationId: number) => { 
  try {
    await axios.delete(`${BASE_URL}/employee/${employeeId}/specialization/${specializationId}`);
  } catch (error) {
    console.error('Error removing specialization from employee:', error);
    throw error;
  }
}

export const createSalonSpecialization = async (salonId: number, specialization: SpecializationEnum, serviceIds: number[] = []) => {
  try {
    const response = await axios.post(`${BASE_URL}/specialization/salon/${salonId}`, { specialization, serviceIds });
    return response.data;
  } catch (error) {
    console.error('Error creating salon specialization:', error);
    throw error;
  }
}

export const updateSpecialization = async(specialiationId: number, specialization: SpecializationEnum, serviceIds: number[] = []): Promise<Specialization> => {
  try {
    console.log('Updating specialization:', { specialization, serviceIds });
     const response = await axios.put(`${BASE_URL}/specialization/${specialiationId}`, { specialization, serviceIds });
     return response.data;
  } catch (error) {
    console.error('Error updating salon specialization:', error);
    throw error;
  }
}

export const deleteSalonSpecialization = async ( specializationId: number) => {
  try {
    await axios.delete(`${BASE_URL}/specialization/${specializationId}`);
  } catch (error) {
    console.error('Error deleting salon specialization:', error);
    throw error;
  }
}

export interface AvailableAppointment {
  date: string; 
  availableTimes: string[]; 
}

export interface ClientAppointment {
  id: number;
  salonName: string;
  serviceName: string;
  servicePrice: number;
  serviceDurationMinutes: number;
  scheduledTime: string;
  scheduledDate: string;
  status: string;
  createdAt: string;
  employeeFullName: string;
  employeeNumber: string;
  reviewId?: number;
}

export interface ReviewRequest {
  rating: number;
  comment: string;
}

export const submitReview = async(appointmentId: number, clientId: number, request: ReviewRequest): Promise<Review> => {
  try {
    const response = await axios.post(`${BASE_URL}/review/appointment/${appointmentId}/client/${clientId}`, request);
    return response.data;
  } catch (error) {
    console.error("Failed to submit review:", error);
    throw error;
  }
}

export interface AppointmentRequest {
  salonId: number;
  clientId: number;
  employeeId: number;
  serviceId: number;
  scheduledTime: string;
  scheduledDate: string;
}

export const bookAppointment = async (request: AppointmentRequest): Promise<ClientAppointment> => {
  try {
    const response = await axios.post(`${BASE_URL}/appointment`, { request });
    return response.data;
  } catch (error) {
    console.error("Failed to book appointment:", error);
    throw error;
  }
}

export const fetchClientAppointments = async (clientId: number): Promise<ClientAppointment[]> =>{
  try {
    const response = await axios.get(`${BASE_URL}/client/${clientId}/appointments`);
    return response.data; 
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

export const fetchEmployeeAppointments = async (employeeId: number): Promise<EmployeeAppointment[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/appointment/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee appointments:", error);
    throw error;
  }
};

export const fetchEmployeeSpecializations = async (userId: number): Promise<Specialization[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/${userId}/specializations`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee specializations:", error);
    throw error;
  }
};

export const fetchEmployeesByService = async (serviceId: number): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/by-service/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employees by service:", error);
    throw error;
  }
}

export const updateUserPersonalInfo = async (userId: number, form: UserUpdateForm): Promise<void> => {  
  try {
    await axios.put(`${BASE_URL}/user/${userId}`, form);
  } catch (error) {
    console.error("Failed to update user personal info:", error);
    throw error;
  }
}

export const updateEmployeeSpecializations = async (employeeId: number, specializations: Specialization[]): Promise<Specialization[]> => {
  try {
    const specializationPayload = specializations.map(spec => ({
      id: spec.id, // Only include this if it's already stored; otherwise, it could be undefined for new specs
      specialization: spec.name // Ensure this matches the backend expected enum value
    }));
    const response = await axios.put(`${BASE_URL}/employee/${employeeId}/specializations`, { specializations: specializationPayload });
    return response.data;
  } catch (error) {
    console.error("Failed to update employee specializations:", error);
    throw error;
  }
};

export interface ScheduleRequest {
  dayOfWeek: DayOfWeek;
  openingTime: string;
  closingTime: string;
  type: ScheduleType;
}
export const fetchEmployeeSchedule = async (employeeId: number): Promise<Schedule[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/employee/${employeeId}/schedule`);
    return response.data;
  } catch (error) {
    console.error("Failed to load employee schedule:", error);
    throw error; 
  }
};


export const updateSchedule = async (scheduleId: number, schedule: ScheduleRequest): Promise<ScheduleRequest> => {
  try {
    const response = await axios.put(`${BASE_URL}/schedule/${scheduleId}`, schedule);
    return response.data;
  } catch (error) {
    console.error("Failed to update schedule:", error);
    throw error;
  }
}

export const addEmployeeSchedule = async (employeeId: number, schedule: ScheduleRequest): Promise<ScheduleRequest> => {
  try {
    const response = await axios.post(`${BASE_URL}/schedule/employee/${employeeId}`, schedule);
    return response.data;
  } catch (error) {
    console.error("Failed to add employee schedule:", error);
    throw error;
  }
};


export const addSalonSchedule = async (salonId: string, schedule: ScheduleRequest): Promise<ScheduleRequest> => {
  try {
    const response = await axios.post(`${BASE_URL}/schedule/${salonId}`, schedule);
    return response.data;
  } catch (error) {
    console.error("Failed to add schedule:", error);
    throw error;
  }
}

export const deleteSchedule = async (scheduleId: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/schedule/${scheduleId}`);
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    throw error;
  }
}

export const loadSpecializations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/specialization/enums`);
    const data = await response.json();
    return data; // List of enums from backend
  } catch (error) {
    console.error("Error fetching specializations:", error);
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

export const fetchLocation = async (salonId: number): Promise<Location> => {  
  try {
    const response = await axios.get(`${BASE_URL}/salon/${salonId}/location`);
    return response.data;
  } catch (error) {
    console.error("Failed to load salon location:", error);
    throw error;
  }
}

export const updateSalonLocation = async (locationId: string, location: Location): Promise<Location> => {
  try {
    const response= await axios.put(`${BASE_URL}/location/${locationId}`, location);
    return response.data;
  } catch (error) {
    console.error("Failed to update salon location:", error);
    throw error;
  }
};

export interface LocationRequest {
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  city: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  zipCode: string;
}

export const createSalonLocation = async (salonId: string, locationRequest: LocationRequest): Promise<Location> => {
  try {
    const response = await axios.post(`${BASE_URL}/location/${salonId}`, locationRequest);
    return response.data;
  } catch (error) {
    console.error("Failed to create salon location:", error);
    throw error;
  }
}

export const deleteSalonLocation = async (locationId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/location/${locationId}`);
  } catch (error) {
    console.error("Failed to delete salon location:", error);
    throw error;
  }
}

export interface ServiceRequest {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}


export const addNewService = async (salonId: string, service: ServiceRequest): Promise<ServiceRequest> => {
  try {
    console.log('Adding service:', service);
    const response = await axios.post(`${BASE_URL}/salon_service/${salonId}`, service);
    return response.data; 
  } catch (error) {
    console.error("Failed to add new service:", error);
    throw error;
  }
}


export const deleteService = async (serviceId: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/salon_service/${serviceId}`);
  } catch (error) {
    console.error("Failed to delete service:", error);
    throw error;
  }
}


export const updateService = async (serviceId: number, service: Service): Promise<Service> => {
  try {
    const response = await axios.put(`${BASE_URL}/salon_service/${serviceId}`, service);
    return response.data;
  } catch (error) {
    console.error("Failed to update salon services:", error);
    throw error;
  }
};

export const updateSalonInfo = async (salonId: number, SalonRequest: Partial<Salon>): Promise<Salon> => {
  try {
    const response = await axios.put(`${BASE_URL}/salon/${salonId}`, SalonRequest);
    return response.data;
  } catch (error) {
    console.error('Error updating salon info:', error);
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


export const deleteEmployee = async (employeeId: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/employee/${employeeId}`);
  } catch (error) {
    console.error("Failed to delete employee:", error);
    throw error;
  }
}