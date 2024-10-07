import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import { Link as NavLink} from "react-router-dom";

const SalonOwnerInfo: React.FC = () => {
    return (
      <>
        <section className="mb-20">
          <Card className="bg-gray-50 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">For Business Owners</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Are you a salon or barber shop owner? Join Hairly to reach more customers and streamline your booking process.</p>
              <NavLink to="/new-business" className="bg-rose-600 px-4 py-2 rounded-xl text-white transition-all duration-300 ease-in-out transform hover:bg-rose-700 hover:scale-110 ">
                Add Your Business
              </NavLink>
            </CardContent>
          </Card>
        </section>
    </>
    );
};
export default SalonOwnerInfo;