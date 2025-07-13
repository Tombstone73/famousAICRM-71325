import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Trash2 } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductFilesTabProps {
  product: Partial<Product>;
  onChange: (updates: Partial<Product>) => void;
}

interface FileItem {
  name: string;
  url: string;
  size: number;
  type: string;
}

export const ProductFilesTab: React.FC<ProductFilesTabProps> = ({ product, onChange }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    
    try {
      const newFiles: FileItem[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // Simulate file upload - in real app would upload to Supabase
        const fileItem: FileItem = {
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type
        };
        newFiles.push(fileItem);
      }
      
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Update product with new file URLs
      const imageUrls = updatedFiles.map(f => f.url);
      onChange({ image_urls: imageUrls });
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    const imageUrls = newFiles.map(f => f.url);
    onChange({ image_urls: imageUrls });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.ai,.eps,.psd"
                onChange={handleFileUpload}
                disabled={uploading}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                Supports images, PDFs, and design files (max 10MB each)
              </p>
            </div>
          </div>
          
          {uploading && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Uploading files...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <File className="h-4 w-4 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(file.size)}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};