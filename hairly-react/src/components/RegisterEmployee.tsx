
const RegisterEmployee = () => {
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
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="John"
                    required={true}
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Your Surname
                  </label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-rose-500 dark:focus:border-rose-500"
                    placeholder="Kowalski"
                    required={true}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block mb-2 text-sm font-medium text-rose-900 dark:text-black">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="bg-rose-50 border border-rose-300 text-rose-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-rose-100 dark:border-rose-300 dark:placeholder-rose-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="123-456-789"
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-rose-700 rounded bg-rose-900 focus:ring-3 focus:ring-primary-300 dark:bg-rose-700 dark:border-rose-600 dark:focus:ring-primary-600 dark:ring-offset-rose-800"
                      required={true}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-rose-500 dark:text-rose-700">
                      I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a>
                    </label>
                  </div>
                </div>
                <div>
                  <button type="submit" className="flex w-full justify-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">
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
}

export default RegisterEmployee;
