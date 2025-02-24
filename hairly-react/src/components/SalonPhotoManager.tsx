import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from 'axios';
import { convertToBase64 } from '@/apiService';
import {useTranslation} from 'react-i18next';


interface SalonPhoto {
  id: number;
  salonId: number;
  imageData: Uint8Array;
  contentType: string;
  filename: string;
}

interface SalonPhotoManagerProps {
  salonId: string;
  // onUpdatePhotos: (photos: SalonPhoto[]) => void;
}

export function SalonPhotoManager({ salonId }: SalonPhotoManagerProps) {
  const [localPhotos, setLocalPhotos] = useState<SalonPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {t} = useTranslation();

  useEffect(() => {
    if (!salonId) {
      return; 
    }
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8080/api/v1/image/${salonId}/salonImages`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const photos: SalonPhoto[] = response.data.map((photo: any) => {
          return {
            id: photo.id,
            salonId: salonId, 
            url: convertToBase64(photo.imageData, photo.contentType)
          };
        });

        setLocalPhotos(photos);
        // onUpdatePhotos(photos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [salonId]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      try {
        const uploadedPhotos = await Promise.all(
          Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append("image", file);
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8080/api/v1/image/${salonId}`, formData, {
              headers: { "Content-Type": "multipart/form-data",Authorization: `Bearer ${token}` }
            });
            console.log('Upload successful:', response.data);
            const { id, imageData, contentType } = response.data;
            const base64Url = convertToBase64(imageData, contentType);

            return {
              id,
              salonId: salonId,
              url: base64Url
            };
          })
        );

        setLocalPhotos((prevPhotos) => [...prevPhotos, ...uploadedPhotos]);
        //onUpdatePhotos((prevPhotos) => [...prevPhotos, ...uploadedPhotos]);

        toast.success("Photos uploaded successfully!");
      } catch (error) {
        console.error("Error uploading photos:", error);
        toast.error("Failed to upload photos.");
      }
    }
  };
  const handleRemovePhoto = async (id: number) => {

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8080/api/v1/image/${id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPhotos = localPhotos.filter(photo => photo.id !== id);
      setLocalPhotos(updatedPhotos);
      //onUpdatePhotos(updatedPhotos);
      toast.success("Photo removed successfully!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to remove photo.");
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-4 bg-gray-100 mb-4 rounded-xl">
        <CardTitle>{t('salonInfo.salonPhotos')}</CardTitle>
        <div className="flex space-x-2">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="bg-white hover:bg-gray-100 rounded-xl"
          >
            <Upload className="w-4 h-4" /> {t('button.add')}
          </Button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {localPhotos?.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <img 
                src={photo.url} 
                alt={`Salon photo ${index + 1}`} 
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                <Button
                  onClick={() => handleRemovePhoto(photo.id)} 
                  variant="destructive"
                  size="icon"
                  className="mr-2"
                >
                  <X className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SalonPhotoManager;
