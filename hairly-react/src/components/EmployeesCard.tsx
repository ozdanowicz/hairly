import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash, Plus } from "lucide-react";
import defaultProfile from "@/assets/defaultProfile.png";
import {
  EmployeeDetails,
  fetchEmployeeDetails,
  assignSpecializationToEmployee,
  deleteEmployeeFromSalon,
  Specialization,
  addEmployeeToSalon,
  doesUserWithEmailExists, 
} from "@/apiService";
import {fetchEmployeesBySalon} from "../salonService.ts";
import { useTranslation } from 'react-i18next';


const EmployeesCard: React.FC<{
  salonId: number;
  isOwnerDashboard: boolean;
  specializations: Specialization[];
}> = ({ salonId, isOwnerDashboard, specializations }) => {
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [selectedSpecializationIds, setSelectedSpecializationIds] = useState<number[]>([]);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        console.log(salonId);
        const employeeList = await fetchEmployeesBySalon(salonId);
        const detailedEmployees = await Promise.all(
          employeeList.map(async (employee) => {
            const detailedEmployee = await fetchEmployeeDetails(employee.id);
            return detailedEmployee;
          })
        );
        setEmployees(detailedEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        toast.error("Failed to load employees.");
      }
    };
    loadEmployees();
  }, [salonId]);

  function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  const handleAddEmployee = async () => {
    if (!newEmployeeEmail) {
      toast.error(t('toast.error.employeeEmail'));
      return;
    }

    try {
      const fetchedEmployee = await doesUserWithEmailExists(newEmployeeEmail);
      console.log(fetchedEmployee);
      if (!fetchedEmployee) {
        toast.error(t('toast.error.employeeEmailNotFound'));
        return;
      }

      console.log(salonId)
      await addEmployeeToSalon(fetchedEmployee, salonId);

      const updatedEmployees = await fetchEmployeesBySalon(salonId);
      const detailedEmployees = await Promise.all(
        updatedEmployees.map(async (employee) => {
          const detailedEmployee = await fetchEmployeeDetails(employee.id);
          return detailedEmployee;
        })
      );
      setEmployees(detailedEmployees);

      toast.success(t('toast.employeeAdded'));
      setIsAddEmployeeModalOpen(false);
      setNewEmployeeEmail("");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(t('toast.error.employeeEmailNotFound'));
    }
  };

  const handleAssignSpecializations = async (employeeId: number) => {
    try {
      await assignSpecializationToEmployee(employeeId, selectedSpecializationIds);
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === employeeId
            ? {
                ...emp,
                specializations: specializations.filter((spec) =>
                  selectedSpecializationIds.includes(spec.id)
                ),
              }
            : emp
        )
      );
      toast.success(t('toast.specializationSaved'));
      setEditingEmployeeId(null);
      setSelectedSpecializationIds([]);
    } catch (error) {
      console.error("Error assigning specializations:", error);
      toast.error(t('toast.error.specializationSave'));
    }
  };

  const toggleSpecializationSelection = (specializationId: number) => {
    setSelectedSpecializationIds((prev) =>
      prev.includes(specializationId)
        ? prev.filter((id) => id !== specializationId)
        : [...prev, specializationId]
    );
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      setDeleteModalOpen(true);
      await deleteEmployeeFromSalon(employeeId);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId)
      );
      toast.success(t('toast.employeeDeleted'));
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(t('toast.error.employeeDeleted'));
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-4 mb-3 bg-gray-100 rounded-xl">
        {isOwnerDashboard ? (
          <>
            <CardTitle>{t('employee.title')}</CardTitle>
            <Button
              className="rounded-xl border-none bg-white"
              onClick={() => setIsAddEmployeeModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4" /> {t('button.add')}
            </Button>
          </>
        ) : (
          <CardTitle>{t('employee.teamTitle')}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center space-x-4 border rounded-xl p-3">
              <Avatar>
                <AvatarImage
                  src={employee.profilePicture || defaultProfile}
                  alt={employee.name}
                />
                <AvatarFallback>{employee.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full space-y-1">
                <p className="font-medium">{employee.name} {employee.surname}</p>
                <p className="text-sm text-gray-500 mb-4">{employee.email}</p>
                <div className="flex flex-wrap gap-2">
                  {employee.specializations.map((spec) => (
                    <p key={spec.id} className="mt-2 rounded-xl bg-gray-50 border border-gray-300 pl-1.5 pr-1.5 pt-1 pb-1 text-sm text-gray-600">
                      {capitalizeFirstLetter(spec.specialization.toLowerCase())}
                    </p>
                  ))}
                </div>
                {editingEmployeeId === employee.id && isOwnerDashboard ? (
                  <>
                    <div className="flex flex-col space-y-2 mt-4">
                      {specializations.map((spec) => (
                        <label key={spec.id} className="flex items-center space-x-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={selectedSpecializationIds.includes(spec.id)}
                            onChange={() => toggleSpecializationSelection(spec.id)}
                          />
                          <span>{capitalizeFirstLetter(spec.specialization.toLowerCase())}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignSpecializations(employee.id)}
                        className="rounded-xl border-none"
                      >
                        <Save className="w-4 h-4" /> {t('button.save')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingEmployeeId(null)}
                        className="ml-2 rounded-xl bg-gray-100"
                      >
                        <X className="w-4 h-4" /> {t('button.cancel')}
                      </Button>
                    </div>
                  </>
                ) : (
                  isOwnerDashboard && (
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-none shadow mr-2"
                        onClick={() => {
                          setEditingEmployeeId(employee.id);
                          setSelectedSpecializationIds(
                            employee.specializations.map((spec) => spec.id)
                          );
                        }}
                      >
                        <Edit className="w-4 h-4" /> {t('button.edit')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-none shadow bg-rose-700 text-white"
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash className="w-4 h-4" /> {t('button.delete')}
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {/* <Dialog open={isDeleteModalOpen} onOpenChange={(open) => setDeleteModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently delete this employee?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)} // Close the dialog without deletion
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee} // Confirm and delete employee
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <h2 className="text-xl font-medium mb-4">{t('employee.addNew')}</h2>
            <input
              type="email"
              placeholder={t('employee.email')}
              value={newEmployeeEmail}
              onChange={(e) => setNewEmployeeEmail(e.target.value)}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="rounded-xl bg-gray-100"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddEmployeeModalOpen(false)} // Close modal
              >
                {t('button.cancel')}
              </Button>
              <Button
                className="rounded-xl border-none shadow"
                variant="outline"
                size="sm"
                onClick={handleAddEmployee}
              >
                {t('button.add')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmployeesCard;
