import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useArtworkFiles, ArtworkFile } from '@/hooks/useArtworkFiles';
import { cn } from '@/lib/utils';

interface ArtworkUploadProps {
  orderId: string;
  className?: string;
}

export const ArtworkUpload: React.FC<ArtworkUploadProps> = ({ orderId, className }) => {
  const { files, loading, uploadFile, deleteFile, getFileUrl } = useArtworkFiles(orderId);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        await uploadFile(file, orderId);
        toast({
          title: 'File uploaded',
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          variant: 'destructive',
        });
      }
    }
  }, [orderId, uploadFile, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg'],
      'application/pdf': ['.pdf'],
      'application/postscript': ['.ai', '.eps'],
      'application/illustrator': ['.ai'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleDelete = async (file: ArtworkFile) => {
    try {
      await deleteFile(file.id);
      toast({
        title: 'File deleted',
        description: `${file.original_filename} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (file: ArtworkFile) => {
    try {
      const url = await getFileUrl(file.file_path);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.original_filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop files here' : 'Upload artwork files'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: Images, PDF, AI, EPS (Max 50MB per file)
          </p>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Uploaded Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.mime_type)}
                  <div>
                    <p className="font-medium text-sm">{file.original_filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(file)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};