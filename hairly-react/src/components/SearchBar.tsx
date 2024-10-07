import { useState } from 'react';
import { Scissors, MapPin, Calendar, Search, SprayCan } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function Component() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        {/* Salon Name Input (Larger) */}
        <div className="relative flex-grow min-w-[200px] w-full sm:w-[300px] rounded-xl"> {/* Increased size */}
          <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input 
            type="text" 
            placeholder="Salon Name" 
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
          />
        </div>

        {/* Service Dropdown (Non-transparent, Equal Size) */}
        <div className="relative flex-grow min-w-[200px] w-full sm:w-auto">
          <SprayCan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} /> {/* Cut icon */}
          <Select>
            <SelectTrigger className="pl-10 w-full border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg rounded-xl border-gray-300">
              <SelectItem value="haircut">Haircut</SelectItem>
              <SelectItem value="coloring">Coloring</SelectItem>
              <SelectItem value="styling">Styling</SelectItem>
              <SelectItem value="beard-trim">Beard Trim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City Input (Equal Size) */}
        <div className="relative flex-grow min-w-[200px] w-full sm:w-[200px] rounded-xl">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
          <Input 
            type="text" 
            placeholder="City" 
            className="pl-10 border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-300 rounded-xl"
          />
        </div>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
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
        </Popover>

        {/* Search Button */}
        <Button className="bg-red-500 hover:bg-red-500 text-white min-w-[100px] w-full sm:w-auto rounded-xl">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
}
