import Card from "./Card"
const HomeCards = () => {
  return (
    <>
     <section className="py-4">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
           <Card>
           <h2 className="text-3xl font-bold">For Clients</h2>
            <p className="mt-2 mb-4">
              Browse our base of hair salons and barber shops to find perfect service for you
            </p>
            <a
              href="/jobs.html"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
            >
              Browse
            </a>
           </Card>
           <Card bg= 'bg-rose-100'>
           <h2 className="text-3xl font-bold">For Business</h2>
            <p className="mt-2 mb-4">
             Add your salon and look how it grows
            </p>
            <a
              href="/add-job.html"
              className="inline-block bg-rose-400 text-white rounded-lg px-4 py-2 hover:bg-rose-500"
            >
              Add Salon
            </a>
           </Card>
          </div>
        </div>
    </section>
    </>
  )
}

export default HomeCards