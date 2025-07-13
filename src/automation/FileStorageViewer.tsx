import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Folder, File, Database, Server, HardDrive, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArtworkFiles } from '@/hooks/useArtworkFiles';

interface StorageLocation {
  type: 'supabase' | 'local' | 'hotfolder' | 'company';
  path: string;
  status: 'active' | 'pending' | 'error';
  fileCount: number;
  description: string;
}

interface FileStorageViewerProps {
  orderId?: string;
  className?: string;
}

export const FileStorageViewer: React.FC<FileStorageViewerProps> = ({ orderId, className }) => {
  const { files } = useArtworkFiles(orderId);
  const { toast } = useToast();
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStorageStatus = async () => {
    setLoading(true);
    try {
      // Check Supabase storage
      const supabaseStorage: StorageLocation = {
        type: 'supabase',
        path: 'Supabase Storage Bucket: artwork/',
        status: 'active',
        fileCount: files.length,
        description: 'Cloud storage for uploaded files before processing'
      };

      // Check local storage status via API
      const localStorageChecks = await Promise.allSettled([
        fetch('/api/storage/local-status'),
        fetch('/api/storage/hotfolder-status'),
        fetch('/api/storage/company-folders')
      ]);

      const locations = [supabaseStorage];

      // Add local storage if available
      if (localStorageChecks[0].status === 'fulfilled') {
        locations.push({
          type: 'local',
          path: 'Local Server: /temp/processing/',
          status: 'active',
          fileCount: 0,
          description: 'Temporary storage during file processing'
        });
      }

      // Add hotfolder status
      if (localStorageChecks[1].status === 'fulfilled') {
        locations.push({
          type: 'hotfolder',
          path: 'Hotfolders: /print/hotfolders/',
          status: 'active',
          fileCount: 0,
          description: 'Files routed to printer hotfolders'
        });
      }

      // Add company folders
      if (localStorageChecks[2].status === 'fulfilled') {
        locations.push({
          type: 'company',
          path: 'Company Archives: /companies/{company_name}/',
          status: 'active',
          fileCount: 0,
          description: 'Permanent storage in company-specific folders'
        });
      }

      setStorageLocations(locations);
    } catch (error) {
      toast({
        title: 'Failed to check storage status',
        description: 'Could not retrieve storage information',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStatus();
  }, [files.length]);

  const getStorageIcon = (type: string) => {
    switch (type) {
      case 'supabase': return <Database className="h-4 w-4" />;
      case 'local': return <Server className="h-4 w-4" />;
      case 'hotfolder': return <Folder className="h-4 w-4" />;
      case 'company': return <HardDrive className="h-4 w-4" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              File Storage Locations
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStorageStatus}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Storage Overview</TabsTrigger>
              <TabsTrigger value="flow">Processing Flow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  Files are initially stored in Supabase cloud storage, then processed through local systems if configured.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                {storageLocations.map((location, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStorageIcon(location.type)}
                        <div>
                          <p className="font-medium">{location.path}</p>
                          <p className="text-sm text-gray-600">{location.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{location.fileCount} files</Badge>
                        <Badge className={getStatusColor(location.status)}>
                          {location.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="flow" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Upload to Supabase</p>
                    <p className="text-sm text-gray-600">Files uploaded via webapp are stored in Supabase cloud storage</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Local Processing (Optional)</p>
                    <p className="text-sm text-gray-600">Python service downloads and processes files locally</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">File Routing</p>
                    <p className="text-sm text-gray-600">Files copied to company folders and routed to hotfolders</p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>Note:</strong> Local processing requires either hosting the webapp locally or running a Python service. 
                  Without local processing, files remain in Supabase storage only.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileStorageViewer;