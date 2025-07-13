import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  productId?: string;
}

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onImagesChange,
  productId
}) => {
  const [uploading, setUploading] = useState(false);
  const { uploadProductImage } = useProducts();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadProductImage(file, productId || 'temp')
      );
      const urls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...urls]);
      toast({
        title: 'Success',
        description: `${urls.length} image(s) uploaded successfully`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Upload Images</Label>
        <div className="mt-2">
          <Input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <Upload className="h-4 w-4 mr-1 animate-spin" />
              Uploading images...
            </p>
          )}
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <div className="relative">
                  <img
                    src={url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1">
                      <span className="text-xs bg-blue-500 text-white px-1 rounded">
                        Main
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Image className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              No images uploaded yet
            </p>
            <p className="text-sm text-gray-400 text-center mt-1">
              Upload images to showcase your product
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};