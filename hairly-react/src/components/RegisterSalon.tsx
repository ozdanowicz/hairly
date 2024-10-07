import { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterSalon = () => {
  // States for form inputs
  const [salonName, setSalonName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState([
    { id: "haircut", name: "Haircut" },
    { id: "coloring", name: "Coloring" },
    { id: "styling", name: "Styling" },
    { id: "treatments", name: "Treatments" },
    { id: "extensions", name: "Extensions" },
    { id: "makeup", name: "Makeup" },
  ]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("You need to accept the terms and conditions.");
      return;
    }

    const salonData = {
      salonName,
      location,
      description,
      phone,
      selectedServices,
    };

    console.log("Salon Registered:", salonData);
    // You can handle sending salonData to your backend here
  };

  // Handle service checkbox change
  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <>
      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: `url(${'src/assets/collage_background.png'})` }}
      >
        <div className="flex flex-col rounded-xl items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg--200 dark:border--700 opacity-90">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-ro-900 md:text-2xl dark:text-black">
                Create an account
              </h1>
              <br />
              <form className="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
                
                {/* Salon Name */}
                <div>
                  <label htmlFor="salon-name" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Salon Name
                  </label>
                  <input
                    type="text"
                    name="salon-name"
                    id="salon-name"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="Happy Hair Salon"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="123 Main Street"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Phone Number (optional) */}
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="123-456-789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Services */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Services Offered
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceChange(service.id)}
                        />
                        <label htmlFor={service.id} className="text-sm text-rose-900 dark:text-black">
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="Describe your salon"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-rose-700 rounded bg-rose-900 focus:ring-3 focus:ring-primary-300 dark:bg-rose-700 dark:border-rose-600 dark:focus:ring-primary-600 dark:ring-offset-rose-800"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-rose-500 dark:text-rose-700">
                      I accept the <Link className="font-medium text-primary-600 hover:underline dark:text-primary-500" to="#">Terms and Conditions</Link>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Create an account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterSalon;
