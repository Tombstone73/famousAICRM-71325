import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image, Settings, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useArtworkFiles, ArtworkFile } from '@/hooks/useArtworkFiles';
import { cn } from '@/lib/utils';

interface EnhancedArtworkUploadProps {
  orderId: string;
  companyId?: string;
  className?: string;
}

interface UploadSettings {
  enableRenaming: boolean;
  namingTemplate: string;
  copyToCompanyFolder: boolean;
  routeToHotfolder: boolean;
}

export const EnhancedArtworkUpload: React.FC<EnhancedArtworkUploadProps> = ({ 
  orderId, 
  companyId, 
  className 
}) => {
  const { files, loading, uploadFile, deleteFile, getFileUrl } = useArtworkFiles(orderId);
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<UploadSettings>({
    enableRenaming: false,
    namingTemplate: '{company}_{orderNumber}_{originalName}',
    copyToCompanyFolder: true,
    routeToHotfolder: true
  });

  const generateNewFilename = (originalName: string) => {
    if (!settings.enableRenaming) return originalName;
    
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.');
    const extension = originalName.split('.').pop();
    
    let newName = settings.namingTemplate
      .replace('{company}', 'ACME_Corp') // Would be replaced with actual company name
      .replace('{orderNumber}', orderId)
      .replace('{originalName}', nameWithoutExt)
      .replace('{date}', new Date().toISOString().split('T')[0])
      .replace('{timestamp}', Date.now().toString());
    
    // Clean up filename
    newName = newName.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    return `${newName}.${extension}`;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      try {
        const processedFilename = generateNewFilename(file.name);
        
        // Upload to Supabase with original filename
        await uploadFile(file, orderId);
        
        // If local processing is enabled, trigger file operations
        if (settings.copyToCompanyFolder || settings.routeToHotfolder) {
          await triggerLocalProcessing(file, processedFilename);
        }
        
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
  }, [orderId, uploadFile, toast, settings]);

  const triggerLocalProcessing = async (file: File, processedFilename: string) => {
    try {
      // This would call your Python service or local processing API
      const response = await fetch('/api/process-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalFilename: file.name,
          processedFilename,
          orderId,
          companyId,
          copyToCompanyFolder: settings.copyToCompanyFolder,
          routeToHotfolder: settings.routeToHotfolder
        })
      });
      
      if (!response.ok) {
        throw new Error('Local processing failed');
      }
    } catch (error) {
      console.warn('Local processing unavailable:', error);
    }
  };

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Artwork</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {showSettings && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableRenaming">Enable File Renaming</Label>
                <p className="text-sm text-gray-600">Rename files during processing</p>
              </div>
              <Switch
                id="enableRenaming"
                checked={settings.enableRenaming}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableRenaming: checked }))}
              />
            </div>

            {settings.enableRenaming && (
              <div>
                <Label htmlFor="template">Naming Template</Label>
                <Input
                  id="template"
                  value={settings.namingTemplate}
                  onChange={(e) => setSettings(prev => ({ ...prev, namingTemplate: e.target.value }))}
                  placeholder="{company}_{orderNumber}_{originalName}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: {'{company}'}, {'{orderNumber}'}, {'{originalName}'}, {'{date}'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="copyCompany">Copy to Company Folder</Label>
                <p className="text-sm text-gray-600">Save copy in company-specific folder</p>
              </div>
              <Switch
                id="copyCompany"
                checked={settings.copyToCompanyFolder}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, copyToCompanyFolder: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="routeHotfolder">Route to Hotfolder</Label>
                <p className="text-sm text-gray-600">Process through hotfolder system</p>
              </div>
              <Switch
                id="routeHotfolder"
                checked={settings.routeToHotfolder}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, routeToHotfolder: checked }))}
              />
            </div>
          </div>
        )}

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
                    {settings.enableRenaming && (
                      <p className="text-xs text-blue-600">
                        Processed as: {generateNewFilename(file.original_filename)}
                      </p>
                    )}
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

export default EnhancedArtworkUpload;