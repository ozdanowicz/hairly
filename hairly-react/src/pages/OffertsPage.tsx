import React from "react"
import Pagination from "../components/Pagination"
import SalonList from "../components/SalonList"
import SearchBar2 from "../components/SearchBar"

const OffertsPage: React.FC = () => {
  return (
    <section className="ng-rose-50 px-4 py-6">
      {/* <SearchBar/> */}
      <SearchBar2/>
      <SalonList/>
      <Pagination />
    </section>
  )
}
export default OffertsPage