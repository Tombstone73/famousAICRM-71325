import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, FolderOpen, HardDrive, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FolderItem {
  name: string;
  path: string;
  isDirectory: boolean;
}

interface FolderBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

const FolderBrowser: React.FC<FolderBrowserProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialPath = ''
}) => {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPath, setSelectedPath] = useState(initialPath);
  const { toast } = useToast();

  const browseFolders = async (path: string) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        'https://zeawvnnkvyicyokpuvkk.supabase.co/functions/v1/fcb3000b-524d-4227-ac1a-6e1703c3fd49',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplYXd2bm5rdnlpY3lva3B1dmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzNzk5NDcsImV4cCI6MjA1MDk1NTk0N30.wBUWJa-0Gy4Ey0xJPNwQ7Iu6Nh_VTVZKlgKYGiNJZQE'
          },
          body: JSON.stringify({ path })
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setFolders(data.folders || []);
      setCurrentPath(path);
      
      if (data.warning) {
        toast({
          title: 'Note',
          description: data.warning,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Browse folders error:', error);
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
      browseFolders(initialPath);
    }
  }, [isOpen, initialPath]);

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
    if (!currentPath) {
      return;
    }
    
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
          <DialogTitle>Browse for Folder</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
            <Button variant="outline" onClick={() => browseFolders(selectedPath)}>
              Go
            </Button>
          </div>
          
          <ScrollArea className="h-64 border rounded">
            <div className="p-2">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
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

export default FolderBrowser;