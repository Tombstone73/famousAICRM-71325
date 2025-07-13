import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { MediaType, MediaGroup } from '@/types/media';

interface MediaTypeCardProps {
  mediaType: MediaType;
  groups: MediaGroup[];
  onAddGroup: (typeId: string, name: string, description?: string) => Promise<void>;
  onDeleteType: (id: string) => Promise<void>;
  onEditType: (id: string, name: string, description?: string) => Promise<void>;
}

export const MediaTypeCard: React.FC<MediaTypeCardProps> = ({
  mediaType,
  groups,
  onAddGroup,
  onDeleteType,
  onEditType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editName, setEditName] = useState(mediaType.name);
  const [editDescription, setEditDescription] = useState(mediaType.description || '');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const typeGroups = groups.filter(g => g.media_type_id === mediaType.id);

  const handleSaveEdit = async () => {
    try {
      await onEditType(mediaType.id, editName, editDescription);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update media type:', error);
    }
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      await onAddGroup(mediaType.id, newGroupName, newGroupDescription);
      setNewGroupName('');
      setNewGroupDescription('');
      setIsAddingGroup(false);
    } catch (error) {
      console.error('Failed to add group:', error);
    }
  };

  return (
    <Card className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {isEditing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8 text-lg font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <CardTitle className="text-lg">{mediaType.name}</CardTitle>
                )}
                <Badge variant="secondary">{typeGroups.length} groups</Badge>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {isEditing ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDeleteType(mediaType.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-3">
              {typeGroups.map((group) => (
                <div key={group.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{group.name}</h4>
                  {group.description && (
                    <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                  )}
                </div>
              ))}
              
              {isAddingGroup ? (
                <div className="p-3 border rounded-lg border-dashed">
                  <div className="space-y-2">
                    <Input
                      placeholder="Group name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddGroup}>
                        <Check className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsAddingGroup(false)}>
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full border-dashed border-2 h-12"
                  onClick={() => setIsAddingGroup(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};