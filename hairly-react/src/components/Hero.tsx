import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import backgroundImage from '../assets/back1.png'; // Import the background image

const Hero: React.FC<{ title?: string, subtitle?: string }> = ({ title = 'Hairly', subtitle = 'Seamless Booking, Flawless Hair' }) => {
  const comp = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t1 = gsap.timeline();
      t1.from("#intro-slider", {
        xPercent: "-100",
        duration: 1,
        delay: 0.1,
      })
      .from(["#title-1", "#title-2"], {
        opacity: 0,
        y: "+=30",
        stagger: 0.5,
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="hero-section py-48 relative"
      ref={comp}
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the imported image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Ensure the hero takes full viewport height
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-8xl font-extrabold text-rose-700 sm:text-7xl md:text-9xl opacity-80" id="title-1">
            {title}
          </h1>
          <p className="my-2 text-2xl text-rose-700 opacity-90 custom-subtitle" id="title-2">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="max-w-lg mx-auto flex text-white">
        <Input
          type="text"
          placeholder="Search for salons or services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow text-rose-500 rounded-xl bg-rose-200 bg-opacity-30 border-rose-200 border-opacity-20"
        />
        <Button className="ml-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </section>
  );
};

export default Hero;