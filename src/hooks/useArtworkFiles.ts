import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ArtworkFile {
  id: string;
  order_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export const useArtworkFiles = (orderId?: string) => {
  const [files, setFiles] = useState<ArtworkFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    if (!orderId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('artwork_files')
        .select('*')
        .eq('order_id', orderId)
        .order('uploaded_at', { ascending: false });
      
      if (error) throw error;
      setFiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, orderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${orderId}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('artwork')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data, error: dbError } = await supabase
        .from('artwork_files')
        .insert({
          order_id: orderId,
          filename: fileName,
          original_filename: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();
      
      if (dbError) throw dbError;
      
      setFiles(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) throw new Error('File not found');
      
      const { error: storageError } = await supabase.storage
        .from('artwork')
        .remove([file.file_path]);
      
      if (storageError) throw storageError;
      
      const { error: dbError } = await supabase
        .from('artwork_files')
        .delete()
        .eq('id', fileId);
      
      if (dbError) throw dbError;
      
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = async (filePath: string) => {
    const { data } = await supabase.storage
      .from('artwork')
      .createSignedUrl(filePath, 3600);
    
    return data?.signedUrl;
  };

  useEffect(() => {
    fetchFiles();
  }, [orderId]);

  return {
    files,
    loading,
    error,
    uploadFile,
    deleteFile,
    getFileUrl,
    refetch: fetchFiles
  };
};