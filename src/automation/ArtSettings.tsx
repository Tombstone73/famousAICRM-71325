import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClientArtMapping {
  id: string;
  clientName: string;
  folderPath: string;
  active: boolean;
}

const ArtSettings: React.FC = () => {
  const [enableCopyToClientFolder, setEnableCopyToClientFolder] = useState(false);
  const [clientMappings, setClientMappings] = useState<ClientArtMapping[]>([
    {
      id: '1',
      clientName: 'ABC Company',
      folderPath: '/art/clients/abc-company',
      active: true
    },
    {
      id: '2', 
      clientName: 'XYZ Corp',
      folderPath: '/art/clients/xyz-corp',
      active: true
    }
  ]);

  const [newMapping, setNewMapping] = useState({
    clientName: '',
    folderPath: ''
  });

  const addMapping = () => {
    if (newMapping.clientName && newMapping.folderPath) {
      const mapping: ClientArtMapping = {
        id: Date.now().toString(),
        clientName: newMapping.clientName,
        folderPath: newMapping.folderPath,
        active: true
      };
      setClientMappings([...clientMappings, mapping]);
      setNewMapping({ clientName: '', folderPath: '' });
    }
  };

  const removeMapping = (id: string) => {
    setClientMappings(clientMappings.filter(m => m.id !== id));
  };

  const toggleMapping = (id: string) => {
    setClientMappings(clientMappings.map(m => 
      m.id === id ? { ...m, active: !m.active } : m
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Art Automation</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Configure client art folder mappings and copy settings
        </p>
      </div>

      {/* Enable Copy to Client Art Folder */}
      <Card>
        <CardHeader>
          <CardTitle>Copy to Client Art Folder</CardTitle>
          <CardDescription>
            Automatically copy artwork files to client-specific folders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={enableCopyToClientFolder}
              onCheckedChange={setEnableCopyToClientFolder}
            />
            <Label>Enable Copy to Client Art Folder</Label>
          </div>
          {enableCopyToClientFolder && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                When enabled, artwork files will be automatically copied to the mapped client folders upon job creation.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Art Folder Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Client Art Folder Mappings</CardTitle>
          <CardDescription>
            Map clients to their specific art folder locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Mapping */}
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium mb-3">Add New Mapping</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Client Name</Label>
                <Input
                  value={newMapping.clientName}
                  onChange={(e) => setNewMapping({...newMapping, clientName: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div className="space-y-2">
                <Label>Folder Path</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newMapping.folderPath}
                    onChange={(e) => setNewMapping({...newMapping, folderPath: e.target.value})}
                    placeholder="/art/clients/client-name"
                  />
                  <Button variant="outline" size="icon">
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={addMapping} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </div>
          </div>

          {/* Existing Mappings */}
          <div className="space-y-3">
            {clientMappings.map((mapping) => (
              <div key={mapping.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={mapping.active}
                    onCheckedChange={() => toggleMapping(mapping.id)}
                  />
                  <div>
                    <div className="font-medium">{mapping.clientName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mapping.folderPath}
                    </div>
                  </div>
                  <Badge variant={mapping.active ? 'default' : 'secondary'}>
                    {mapping.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMapping(mapping.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {clientMappings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No client art folder mappings configured
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtSettings;