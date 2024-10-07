'use client'

import { Button } from "@/components/ui/button"
import { Scissors, Users, TrendingUp } from "lucide-react"
import { Link as NavLink} from "react-router-dom";

export function SalonOwnerLanding() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-rose-200 p-4 text-white">
      <div className="max-w-3xl rounded-xl shadow-md bg-white p-8 backdrop-blur-lg">
        <h1 className="mb-6 text-center text-rose-500 text-4xl font-bold">Grow Your Salon Business</h1>
        <p className="mb-8 text-center text-rose-500 text-xl">
          Register as a hair salon or barber shop owner to help your client base grow and thrive in the digital age.
        </p>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <Scissors className="mb-2 h-12 w-12 text-rose-400" />
            <h2 className="text-lg  text-rose-500 font-semibold">Showcase Your Skills</h2>
            <p className="text-center  text-rose-500 text-sm">Display your best work and services</p>
          </div>
          <div className="flex flex-col items-center">
            <Users className="mb-2 h-12 w-12 text-rose-400" />
            <h2 className="text-lg  text-rose-500  font-semibold">Connect with Clients</h2>
            <p className="text-center  text-rose-500 text-sm">Easily manage appointments and client relationships</p>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="mb-2 h-12 w-12 text-rose-400" />
            <h2 className="text-lg text-rose-500 font-semibold">Boost Your Visibility</h2>
            <p className="text-center text-rose-500 text-sm">Increase your online presence and attract new customers</p>
          </div>
        </div>
        <div className="text-center">
          <Button asChild className="bg-rose-500 rounded-xl px-8 py-4 text-white text-lg font-medium transition-all ease-in-out duration-300 transform hover:bg-rose-600 hover:scale-105">
            <NavLink to="/login">Register Your Salon Now</NavLink>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default SalonOwnerLanding;