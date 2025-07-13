import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, FileText, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const DocumentationSection: React.FC<DocumentationSectionProps> = ({ formData, setFormData }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'setup' | 'images') => {
    const files = Array.from(event.target.files || []);
    if (type === 'setup') {
      setUploadedFiles(prev => [...prev, ...files]);
    } else {
      setProductImages(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number, type: 'setup' | 'images') => {
    if (type === 'setup') {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setProductImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label className="text-sm font-medium">Product Setup Guide</Label>
          <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'setup')}
                    />
                    Upload Files
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, DOC, or images
              </p>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index, 'setup')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Product Images</Label>
          <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <div className="text-center">
              <Image className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="mt-2">
                <Button variant="outline" size="sm" asChild>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp"
                      multiple
                      onChange={(e) => handleFileUpload(e, 'images')}
                    />
                    Upload Images
                  </label>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, or WebP
              </p>
            </div>
            {productImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {productImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeFile(index, 'images')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="customerInstructions" className="text-sm font-medium">
            Customer Instructions
          </Label>
          <Textarea
            id="customerInstructions"
            value={formData.customerInstructions}
            onChange={(e) => setFormData({ ...formData, customerInstructions: e.target.value })}
            placeholder="Instructions for customers when ordering this product"
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="displayOrder" className="text-sm font-medium">
            Display Order in Portal
          </Label>
          <Input
            id="displayOrder"
            type="number"
            min="0"
            value={formData.displayOrder}
            onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spotColorDetection"
              checked={formData.spotColorDetection}
              onCheckedChange={(checked) => setFormData({ ...formData, spotColorDetection: checked })}
            />
            <Label htmlFor="spotColorDetection" className="text-sm font-medium">
              Support spot color detection
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="w2pVisibility"
              checked={formData.w2pVisibility}
              onCheckedChange={(checked) => setFormData({ ...formData, w2pVisibility: checked })}
            />
            <Label htmlFor="w2pVisibility" className="text-sm font-medium">
              Enable W2P (Web-to-Print) visibility
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};