import React from 'react';

interface OffertProps {
  offert: {
    img: string;
    title: string;
    salary: string;
    location: string;
  };
}

const Offert: React.FC<OffertProps> = ({offert}) => {
  return (
    <div className="bg-white rounded-xl shadow-md relative">
    <div className="p-4">
      <div className="mb-4 flex flex-col items-center">
          <img 
              src={offert.img}
              alt="Ad" 
              className="w-96 h-72 mb-3 object-cover 
              rounded-lg opacity-90" 
            />
      </div>
        <div className="mb-5">
          <h3 className="text-xl font-bold">{offert.title}</h3>
          </div>
      <h3 className="text-rose-500 mb-2">{offert.salary}</h3>

      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <div className="text-rose-700 mb-3">
          <i className="fa-solid fa-location-dot text-lg"></i>
          {offert.location}
        </div>
        <a
          href="job.html"
          className="h-[36px] bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-center text-sm"
        >
         Check
        </a>
      </div>
    </div>
  </div>  
  )
}


export default Offert
