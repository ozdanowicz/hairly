import { useState } from 'react';
import { Scissors, MapPin, Calendar, Search } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format} from "date-fns";


interface SearchBarProps {
  onSearch: (query: {
    city?: string;
    location?: [number, number];
    popularity?: string;
    reviews?: string;
    date?: string | number;  
    salonName?: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [sortFilter, setSortFilter] = useState<string>('');

  const handleSearch = () => {
    const searchQuery = {
      salonName: salonName || undefined,
      city: city || undefined,
      date: date ? date.toISOString() : undefined,
      popularity: sortFilter.includes('popularity') ? (sortFilter.includes('highest') ? 'highest' : 'lowest') : undefined,
      reviews: sortFilter.includes('rating') ? (sortFilter.includes('highest') ? 'highest' : 'lowest') : undefined,
    };
  
    onSearch(searchQuery); // Call the onSearch prop with the constructed query
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <div className="relative flex-grow min-w-[200px] w-full sm:w-[300px] rounded-xl">
          <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input
            type="text"
            placeholder="Salon Name"
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); 
              }
            }}
          />
        </div>

        <div className="relative flex-grow min-w-[200px] w-full sm:w-[200px] rounded-xl">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input
            type="text"
            placeholder="City"
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(); 
              }
            }}
          />
        </div>

        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full sm:w-[200px] justify-start text-left font-normal rounded-xl border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 ${!date && "text-muted-foreground"}`}
            >
              <Calendar className="mr-2 h-4 w-4 text-red-500" />
              {date ? format(date, "MM/dd/yyyy") : <span>Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white border-gray-300 rounded-xl" align="start">
            <CalendarComponent
              mode="single"
              selected={date || undefined}
              onSelect={(value) => setDate(value || null)}
              initialFocus
            />
          </PopoverContent>
        </Popover> */}

        <div className="relative flex-grow min-w-[200px] w-full sm:w-auto rounded-xl">
        <Select onValueChange={(value) => setSortFilter(value)}>
          <SelectTrigger className="pl-3 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-lg rounded-xl border-gray-300">
            <SelectItem value="highest_rating">Highest Rating</SelectItem>
            <SelectItem value="lowest_rating">Lowest Rating</SelectItem>
            <SelectItem value="highest_popularity">Most Popular</SelectItem>
            <SelectItem value="lowest_popularity">Least Popular</SelectItem>
            <SelectItem value="alphabetical">A to Z</SelectItem>
            <SelectItem value="reverse_alphabetical">Z to A</SelectItem>
          </SelectContent>
        </Select>
        </div>

        <Button
          className="bg-red-500 hover:bg-red-500 text-white min-w-[100px] w-full sm:w-auto rounded-xl"
          onClick={handleSearch}
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
};
export default SearchBar;