import "/src/index.css"
import InfoCard from "./InfoCard";
import { Scissors, Calendar, Search } from "lucide-react";
const About: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <h3 className="text-2xl font-semibold mb-6 text-center">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <InfoCard
            title="Find"
            description="Discover salons and barber shops in your area with our easy-to-use search."
            Icon={Search}
          />
          <InfoCard
            title="Book"
            description="Choose your preferred time and service, and book your appointment instantly."
            Icon={Calendar}
          />
          <InfoCard
            title="Enjoy"
            description="Sit back, relax, and enjoy your professional hair care experience."
            Icon={Scissors}
          />
        </div>
      </section>
    </main>
  );
}

export default About;
