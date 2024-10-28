import offerts from "../offerts.json"
import Offert from "./Offert"

const OffertListing = ({ isHome = false }) => {
  const offerListings = isHome ? offerts.slice(0,3) : offerts;
  return (
    <>
    <section className="bg-rose-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-rose-700 mb-6 text-center">
        { isHome ? '- New Salons -' : '' }
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {offerListings.map((offert) => (
              <div
                key={offert.id}
                className="relative bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                <Offert offert={offert} />
              </div>
            ))}
          </div>
      </div>
    </section>
    </>
  )
}

export default OffertListing