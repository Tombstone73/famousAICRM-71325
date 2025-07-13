import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Folder, CheckCircle, XCircle, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface HotfolderPath {
  id: string;
  name: string;
  path: string;
  fileTypes: string[];
  autoProcess: boolean;
  status: 'active' | 'inactive' | 'error';
  lastChecked?: string;
}

const HotfolderPaths: React.FC = () => {
  const [hotfolders, setHotfolders] = useState<HotfolderPath[]>([
    {
      id: '1',
      name: 'Business Cards Inbox',
      path: '/hotfolders/business-cards',
      fileTypes: ['pdf', 'ai', 'eps'],
      autoProcess: true,
      status: 'active',
      lastChecked: '2024-01-15 10:30:00'
    },
    {
      id: '2',
      name: 'Large Format Queue',
      path: '/hotfolders/large-format',
      fileTypes: ['pdf', 'tiff', 'jpg'],
      autoProcess: false,
      status: 'active',
      lastChecked: '2024-01-15 10:25:00'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHotfolder, setEditingHotfolder] = useState<HotfolderPath | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    fileTypes: '',
    autoProcess: false,
    status: 'active' as 'active' | 'inactive' | 'error'
  });

  const handleBrowseFolder = () => {
    // In a real application, this would open a native folder browser
    // For now, we'll simulate it with a prompt
    const selectedPath = prompt('Enter folder path:', formData.path || 'C:\\');
    if (selectedPath) {
      setFormData(prev => ({ ...prev, path: selectedPath }));
    }
  };

  const handleSave = () => {
    const fileTypesArray = formData.fileTypes.split(',').map(type => type.trim()).filter(Boolean);
    
    if (editingHotfolder) {
      setHotfolders(prev => prev.map(h => 
        h.id === editingHotfolder.id 
          ? { ...h, ...formData, fileTypes: fileTypesArray }
          : h
      ));
    } else {
      const newHotfolder: HotfolderPath = {
        id: Date.now().toString(),
        ...formData,
        fileTypes: fileTypesArray
      };
      setHotfolders(prev => [...prev, newHotfolder]);
    }
    setIsDialogOpen(false);
    setEditingHotfolder(null);
    setFormData({ name: '', path: '', fileTypes: '', autoProcess: false, status: 'active' });
  };

  const handleEdit = (hotfolder: HotfolderPath) => {
    setEditingHotfolder(hotfolder);
    setFormData({
      name: hotfolder.name,
      path: hotfolder.path,
      fileTypes: hotfolder.fileTypes.join(', '),
      autoProcess: hotfolder.autoProcess,
      status: hotfolder.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHotfolders(prev => prev.filter(h => h.id !== id));
  };

  const testConnection = (hotfolder: HotfolderPath) => {
    // Simulate connection test
    setHotfolders(prev => prev.map(h => 
      h.id === hotfolder.id 
        ? { ...h, status: 'active', lastChecked: new Date().toLocaleString() }
        : h
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Hotfolder Paths</CardTitle>
            <CardDescription>
              Configure automated file processing locations and settings
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingHotfolder(null);
                setFormData({ name: '', path: '', fileTypes: '', autoProcess: false, status: 'active' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Hotfolder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHotfolder ? 'Edit Hotfolder' : 'Add New Hotfolder'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter hotfolder name"
                  />
                </div>
                <div>
                  <Label htmlFor="path">Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="path"
                      value={formData.path}
                      onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))}
                      placeholder="/path/to/hotfolder"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBrowseFolder}
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fileTypes">File Types (comma separated)</Label>
                  <Input
                    id="fileTypes"
                    value={formData.fileTypes}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileTypes: e.target.value }))}
                    placeholder="pdf, ai, eps, jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoProcess"
                    checked={formData.autoProcess}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoProcess: checked }))}
                  />
                  <Label htmlFor="autoProcess">Auto Process Files</Label>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'error') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingHotfolder ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>File Types</TableHead>
              <TableHead>Auto Process</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotfolders.map((hotfolder) => (
              <TableRow key={hotfolder.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4" />
                    <span>{hotfolder.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{hotfolder.path}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {hotfolder.fileTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={hotfolder.autoProcess ? 'default' : 'secondary'}>
                    {hotfolder.autoProcess ? 'Yes' : 'No'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(hotfolder.status)}
                    <span className="capitalize">{hotfolder.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {hotfolder.lastChecked || 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testConnection(hotfolder)}
                    >
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(hotfolder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(hotfolder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HotfolderPaths;