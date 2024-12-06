import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust based on your setup
import { Button } from "@/components/ui/button"; // Adjust based on your setup
import { Save, Edit } from "lucide-react"; // Adjust based on your setup

interface PersonalInfoCardProps {
  info: Record<string, string>; // Generic key-value pairs for personal info
  editMode: boolean;
  onEdit: () => void;
  onSave: (updatedInfo: Record<string, string>) => void;
  isEmailEditable?: boolean; // Optional flag to disable editing for email
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  info,
  editMode,
  onEdit,
  onSave,
  isEmailEditable = true,
}) => {
  const [editableInfo, setEditableInfo] = useState(info);

  const handleInputChange = (key: string, value: string) => {
    setEditableInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveClick = () => {
    onSave(editableInfo);
  };

  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-2 bg-gray-100 rounded-xl mb-2">
      <CardTitle>Personal Information</CardTitle>
      <Button
        className="border-none bg-white rounded-xl"
        variant="ghost"
        size="icon"
        onClick={editMode ? handleSaveClick : onEdit}
      >
        {editMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
      </Button>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {Object.entries(editableInfo).map(([key, value]) => {
          if (key === "id") return null; // Skip rendering the ID
          return (
            <div key={key} className="flex justify-between items-center py-1.5"> {/* Ensure `key` is here */}
              <span className="font-bold text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              {editMode ? (
                key === "email" && !isEmailEditable ? (
                  <input
                    type="text"
                    value={value}
                    disabled
                    className="bg-gray-100 border border-gray-300 text-gray-500 text-sm rounded-xl px-2 py-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    className="border border-gray-300 text-gray-700 text-sm rounded-xl px-2 py-2"
                  />
                )
              ) : (
                <span className="text-sm text-gray-800">{value}</span>
              )}
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);
};

export default PersonalInfoCard;
