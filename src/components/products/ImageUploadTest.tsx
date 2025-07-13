import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function ImageUploadTest() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const testUpload = async (file: File) => {
    setUploading(true);
    try {
      console.log('Starting upload test...');
      console.log('File:', file.name, file.type, file.size);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `test-${Date.now()}.${fileExt}`;
      const filePath = `products/test/${fileName}`;
      
      console.log('Upload path:', filePath);
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });
      
      console.log('Upload result:', { data, error });
      
      if (error) {
        console.error('Upload error:', error);
        toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
        return;
      }
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      console.log('Public URL:', urlData.publicUrl);
      setUploadedUrl(urlData.publicUrl);
      toast({ title: 'Success', description: 'Image uploaded successfully' });
      
    } catch (error) {
      console.error('Test upload error:', error);
      toast({ title: 'Error', description: 'Upload test failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Image Upload Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) testUpload(file);
          }}
          disabled={uploading}
        />
        <Button disabled={uploading} className="w-full">
          {uploading ? 'Testing Upload...' : 'Test Upload'}
        </Button>
        {uploadedUrl && (
          <div className="space-y-2">
            <p className="text-sm text-green-600">Upload successful!</p>
            <img src={uploadedUrl} alt="Uploaded" className="w-full h-32 object-cover rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}