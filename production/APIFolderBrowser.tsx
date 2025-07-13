import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Folder, FolderOpen, HardDrive, ArrowUp, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FolderItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface APIIntegration {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
}

interface APIFolderBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

const APIFolderBrowser: React.FC<APIFolderBrowserProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialPath = ''
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const { toast } = useToast();

  // Mock integrations - in real app, these would come from settings
  const integrations: APIIntegration[] = [
    {
      id: '1',
      name: 'Python Hotfolder Scanner',
      endpoint: 'http://localhost:8000/scan-hotfolder',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '{folder_path}' })
    },
    {
      id: '2',
      name: 'Network Share Browser',
      endpoint: 'http://localhost:8001/browse-network',
      method: 'GET',
      headers: { 'Authorization': 'Bearer token' }
    }
  ];

  const browseFolders = async (path: string) => {
    if (!selectedIntegration) {
      toast({
        title: 'No Integration Selected',
        description: 'Please select an API integration first',
        variant: 'destructive'
      });
      return;
    }

    const integration = integrations.find(i => i.id === selectedIntegration);
    if (!integration) return;

    try {
      setLoading(true);
      
      let requestBody = integration.body;
      if (requestBody) {
        requestBody = requestBody.replace('{folder_path}', path);
      }
      
      const response = await fetch(integration.endpoint, {
        method: integration.method,
        headers: integration.headers,
        body: integration.method !== 'GET' ? requestBody : undefined
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setFolders(data.folders || data.items || []);
      setCurrentPath(path);
      
      if (data.warning) {
        toast({
          title: 'Note',
          description: data.warning,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('API browse error:', error);
      toast({
        title: 'Error',
        description: `Failed to browse folders: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
      setFolders([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setSelectedPath(initialPath);
      setCurrentPath(initialPath);
      if (selectedIntegration) {
        browseFolders(initialPath);
      }
    }
  }, [isOpen, initialPath, selectedIntegration]);

  const handleFolderClick = (folder: FolderItem) => {
    if (folder.isDirectory) {
      setSelectedPath(folder.path);
      browseFolders(folder.path);
    }
  };

  const handleSelect = () => {
    onSelect(selectedPath);
    onClose();
  };

  const goUp = () => {
    if (!currentPath) return;
    
    const separator = currentPath.includes('\\') ? '\\' : '/';
    const pathParts = currentPath.split(separator).filter(part => part);
    
    if (pathParts.length <= 1) {
      setSelectedPath('');
      browseFolders('');
    } else {
      const parentPath = pathParts.slice(0, -1).join(separator) + separator;
      setSelectedPath(parentPath);
      browseFolders(parentPath);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Browse Folders via API</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>API Integration</Label>
            <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
              <SelectTrigger>
                <SelectValue placeholder="Select an API integration" />
              </SelectTrigger>
              <SelectContent>
                {integrations.map((integration) => (
                  <SelectItem key={integration.id} value={integration.id}>
                    {integration.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            <Input
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && browseFolders(selectedPath)}
              className="flex-1"
              placeholder="Enter folder path..."
            />
            <Button 
              variant="outline" 
              onClick={goUp} 
              disabled={!currentPath}
              title="Go up one level"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => browseFolders(selectedPath)}
              disabled={!selectedIntegration}
            >
              Go
            </Button>
          </div>
          
          <ScrollArea className="h-64 border rounded">
            <div className="p-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : !selectedIntegration ? (
                <div className="text-center py-8 text-muted-foreground">
                  Select an API integration to browse folders
                </div>
              ) : folders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No folders found in this location
                </div>
              ) : (
                <div className="space-y-1">
                  {folders.map((folder, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleFolderClick(folder)}
                    >
                      {folder.isDirectory ? (
                        <Folder className="h-4 w-4 text-blue-500" />
                      ) : (
                        <FolderOpen className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm">{folder.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Selected: {selectedPath || 'Root'}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSelect}>
                Select Folder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIFolderBrowser;