import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 

interface InfoCardProps {
  title: string;
  description: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
}

const InfoCard: React.FC<InfoCardProps> = ({ title, description, Icon }) => {
  return (
    <Card className="bg-gray-100 shadow-lg border-none transition-all duration-300 ease-in-out transform hover:scale-105">
      <CardHeader className="text-center text-8px">
        <Icon className="w-8 h-8 text-rose-500 mb-2" /> 
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
