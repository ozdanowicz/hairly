import React, { useState } from "react";
import { Link } from "react-router-dom";

import { createSalon, Service } from "../apiService";
const RegisterSalon = () => {
  const [salon, setSalonData] = useState({
    name: "",
    description: "",
    location: {
      street: "",
      buildingNumber: "",
      apartmentNumber: "",
      latitude: "",
      longitude: "",
      city: "",
      province: "",
      zipCode: "",
    },
    services: [] as Service[],
  });

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Update salon form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSalonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update nested location fields
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSalonData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        [name]: value,
      },
    }));
  };

  // Handle changes in service fields
  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const addService = () => {
    // Validate that all necessary fields are filled out
    if (!newService.name || !newService.description || !newService.price || !newService.durationMinutes) {
      alert("Please fill out all fields for the service.");
      return;
    }

    // Convert the newService object to match the required types in Service
    const completeService: Service = {
      id: Date.now(), // Unique identifier (or use another approach)
      salonId: 0,     // Placeholder value
      name: newService.name,
      description: newService.description,
      price: parseFloat(newService.price), // Convert string to number
      durationMinutes: parseInt(newService.durationMinutes), // Convert string to number
    };

    setSalonData((prevData) => ({
      ...prevData,
      services: [...prevData.services, completeService],
    }));

    setNewService({ name: "", description: "", price: "", durationMinutes: "" });
  };

  // Remove service from list
  const removeService = (index: number) => {
    setSalonData((prevData) => ({
      ...prevData,
      services: prevData.services.filter((_, i) => i !== index),
    }));
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("You need to accept the terms and conditions.");
      return;
    }

    const { latitude, longitude } = salon.location;

    // Validate latitude and longitude are numbers
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      alert("Latitude and Longitude must be valid numbers.");
      return;
    }

    const formattedSalonData = {
      ...salon,
      location: {
        ...salon.location,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      },
      services: salon.services.map((service) => ({
        ...service,
        price: parseFloat(service.price),
        duration: parseInt(service.durationMinutes),
      })),
    };

    try {
      const response = await createSalon(formattedSalonData);
      alert("Salon successfully registered!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error registering salon:", error);
      alert("Failed to register salon. Please try again.");
    }
  };

  return (
    <>
      <section
        className="min-h-screen bg-cover bg-center rounded-xl"
        style={{ backgroundImage: `url(${('src/assets/back1.png')})` }}
      >
        <div className="flex flex-row items-start justify-start px-6 py-8 mx-auto lg:py-0 space-x-4">
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-md dark:border xl:p-0 dark:bg-gray-200 dark:border-gray-700 opacity-96">
            <div className="p-6 space-y-4 rounded-xl md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-rose-900 md:text-2xl dark:text-black">
                Create an account
              </h1>
              <br />
              <form className="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
                <div>
                  <label htmlFor="salon-name" className="block rounded-xl mb-2 text-sm font-bold text-rose-900 dark:text-black">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="salon-name"
                    className="bg-gray-50 border border-rose-100 text-rose-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Happy Hair Salon"
                    value={salon.name}
                    onChange={(e) => setSalonData({ ...salon, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block rounded-xl mb-2 text-sm font-bold text-rose-900 dark:text-black">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="bg-gray-50 border border-rose-100 text-rose-900 text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Describe your salon"
                    value={salon.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Location Fields */}
                <div>
                  <label className="block rounded-xl mb-2 text-sm font-bold text-rose-900 dark:text-black">
                    Location Details
                  </label>
                  <div className="grid rounded-xl grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street"
                      value={salon.location.street}
                      onChange={handleLocationChange}
                      required
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="buildingNumber"
                      placeholder="Building Number"
                      value={salon.location.buildingNumber}
                      onChange={handleLocationChange}
                      required
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="apartmentNumber"
                      placeholder="Apartment Number"
                      value={salon.location.apartmentNumber}
                      onChange={handleLocationChange}
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={salon.location.city}
                      onChange={handleLocationChange}
                      required
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="province"
                      placeholder="Province"
                      value={salon.location.province}
                      onChange={handleLocationChange}
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={salon.location.zipCode}
                      onChange={handleLocationChange}
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="latitude"
                      placeholder="Latitude"
                      value={salon.location.latitude}
                      onChange={handleLocationChange}
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                    <input
                      type="text"
                      name="longitude"
                      placeholder="Longitude"
                      value={salon.location.longitude}
                      onChange={handleLocationChange}
                      className="bg-gray-50 border border-rose-100 text-sm rounded-xl p-2.5"
                    />
                  </div>
                </div>

                {/* Services */}
                <div>
                  <label className="block mb-2 text-sm font-bold text-rose-900 dark:text-black">
                    Add Custom Services
                  </label>

                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Service Name"
                      value={newService.name}
                      onChange={handleNewServiceChange}
                      className="bg-gray-50 rounded-xl border border-rose-100 text-sm p-2.5"
                    />
                    <textarea
                      name="description"
                      placeholder="Service Description"
                      value={newService.description}
                      onChange={handleNewServiceChange}
                      className="bg-gray-50 rounded-xl border border-rose-100 text-sm p-2.5"
                    />
                    <input
                      type="text"
                      name="price"
                      placeholder="Price"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="bg-gray-50 rounded-xl border border-rose-100 text-sm p-2.5"
                    />
                    <input
                      type="text"
                      name="durationMinutes"
                      placeholder="Duration (minutes)"
                      value={newService.durationMinutes}
                      onChange={handleNewServiceChange}
                      className="bg-gray-50 rounded-xl border border-rose-100 text-sm p-2.5"
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="bg-rose-600 rounded-xl text-white px-1 py-2"
                    >
                      Add Service
                    </button>
                  </div>
                </div>

                {/* Display added services */}
                <div>
                  {salon.services.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-rose-900">Services List:</h3>
                      <ul>
                        {salon.services.map((service, index) => (
                          <li key={index} className="mt-2">
                            {service.name} - ${service.price} - {service.durationMinutes} minutes
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="ml-4 text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-rose-700 rounded-xl bg-rose-900 focus:ring-3 focus:ring-primary-300"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-rose-500">
                      I accept the <Link className="font-medium text-primary-600 hover:underline" to="#">Terms and Conditions</Link>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-xl bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-700"
                  >
                    Create an account
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/3"></div>
        </div>
      </section>
    </>
  );
};

export default RegisterSalon;

