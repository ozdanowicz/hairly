import {Link} from "react-router-dom"
import "/src/index.css"


const ViewAllOfferts = () => {
  return (
    <section className="m-auto max-w-lg my-10 px-6">
    <Link
      to="/offerts"
      className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >View All Offerts</Link>
  </section>
  )
}

export default ViewAllOfferts