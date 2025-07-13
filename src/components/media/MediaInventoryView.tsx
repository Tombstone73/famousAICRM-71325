import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Download, Upload } from 'lucide-react';
import { MediaTypeCard } from './MediaTypeCard';
import { useMediaInventory } from '@/hooks/useMediaInventory';
import { useToast } from '@/hooks/use-toast';

export const MediaInventoryView: React.FC = () => {
  const { data, loading, error, addMediaType, updateMediaType, addMediaGroup, deleteMediaType } = useMediaInventory();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingType, setIsAddingType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');

  const filteredTypes = data.types.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description && type.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      await addMediaType(newTypeName, newTypeDescription);
      setNewTypeName('');
      setNewTypeDescription('');
      setIsAddingType(false);
      toast({
        title: 'Success',
        description: 'Media type added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add media type',
        variant: 'destructive'
      });
    }
  };

  const handleAddGroup = async (typeId: string, name: string, description?: string) => {
    try {
      await addMediaGroup(typeId, name, description);
      toast({
        title: 'Success',
        description: 'Media group added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add media group',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteType = async (id: string) => {
    try {
      await deleteMediaType(id);
      toast({
        title: 'Success',
        description: 'Media type deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete media type',
        variant: 'destructive'
      });
    }
  };

  const handleEditType = async (id: string, name: string, description?: string) => {
    try {
      await updateMediaType(id, name, description);
      toast({
        title: 'Success',
        description: 'Media type updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update media type',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading media inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Inventory / Pricing</h1>
          <p className="text-muted-foreground mt-1">
            Manage print media types, groups, and pricing
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media types and groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddingType} onOpenChange={setIsAddingType}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Media Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Media Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  placeholder="e.g., Roll, Flatbed, Small Format"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="Brief description of this media type"
                  value={newTypeDescription}
                  onChange={(e) => setNewTypeDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setIsAddingType(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddType}>
                  Add Type
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredTypes.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-muted-foreground">No media types found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'Add your first media type to get started'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredTypes.map((type) => (
            <MediaTypeCard
              key={type.id}
              mediaType={type}
              groups={data.groups}
              onAddGroup={handleAddGroup}
              onDeleteType={handleDeleteType}
              onEditType={handleEditType}
            />
          ))
        )}
      </div>
    </div>
  );
};