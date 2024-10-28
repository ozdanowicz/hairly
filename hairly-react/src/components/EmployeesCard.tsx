import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeDetails, fetchEmployeeDetails, fetchEmployeesBySalon } from "@/apiService";
import { useEffect, useState } from "react";
import defaultProfile from '@/assets/defaultProfile.png';

const EmployeesCard: React.FC<{ salonId: number }> = ({ salonId }) => {
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeeList = await fetchEmployeesBySalon(salonId);
        if (!employeeList || !employeeList.length) {
          setEmployees([]);  // No employees found, set empty array
        } else {
          const detailedEmployees = await Promise.all(
            employeeList.map(async (employee) => {
              const detailedEmployee = await fetchEmployeeDetails(employee.id);
              return detailedEmployee;
            })
          );
          setEmployees(detailedEmployees);
        }
      } catch (err) {
        setError("Error fetching employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [salonId]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <div>Loading employees...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && employees.length === 0 && !error && (
              <div>Employees are not set yet</div>
            )}
            {!loading && employees.length > 0 && (
              employees.map((employee: EmployeeDetails) => (
                <div key={employee.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={employee.profilePicture || defaultProfile} alt={employee.name} />
                    <AvatarFallback>{employee.name} {employee.surname}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{employee.name} {employee.surname}</p>
                    <p className="text-sm text-gray-500">
                      {employee.specializations?.length > 0
                        ? employee.specializations.map((spec) => spec.name).join(', ')
                        : 'Stylist'
                      }
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeesCard;
