import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Lock } from 'lucide-react';
import { useSidebarPresets, MenuItem } from '@/hooks/useSidebarPresets';
import { useToast } from '@/hooks/use-toast';

const SidebarCustomizer: React.FC = () => {
  const { presets, activePresetId, activePreset, setActivePresetId, savePresets } = useSidebarPresets();
  const [newPresetName, setNewPresetName] = useState('');
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const isDefaultPreset = activePresetId === 'default';

  const handlePresetChange = (presetId: string) => {
    if (presetId === 'default' && presets.length > 1) {
      // If switching to default but there are user presets, create a copy
      const defaultPreset = presets.find(p => p.id === 'default');
      if (defaultPreset) {
        const newPreset = {
          id: `copy-${Date.now()}`,
          name: 'My Preset',
          items: [...defaultPreset.items]
        };
        const updatedPresets = [...presets, newPreset];
        savePresets(updatedPresets, newPreset.id);
        toast({
          title: "Preset created",
          description: "Created a copy of default settings for customization."
        });
        return;
      }
    }
    setActivePresetId(presetId);
  };

  const toggleItem = (itemId: string) => {
    if (isDefaultPreset) {
      toast({
        title: "Cannot modify default",
        description: "Default preset tabs cannot be disabled. Create a custom preset to make changes.",
        variant: "destructive"
      });
      return;
    }
    
    if (!activePreset) return;
    
    const updatedItems = activePreset.items.map(item => 
      item.id === itemId ? { ...item, enabled: !item.enabled } : item
    );
    
    const updatedPresets = presets.map(preset => 
      preset.id === activePresetId 
        ? { ...preset, items: updatedItems }
        : preset
    );
    
    savePresets(updatedPresets);
    toast({
      title: "Settings saved",
      description: "Sidebar preferences updated successfully."
    });
  };

  const createPreset = () => {
    if (!newPresetName.trim()) return;

    const basePreset = activePreset || presets.find(p => p.id === 'default');
    if (!basePreset) return;

    const newPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName,
      items: [...basePreset.items]
    };

    const updatedPresets = [...presets, newPreset];
    savePresets(updatedPresets, newPreset.id);
    setNewPresetName('');
    toast({
      title: "Preset created",
      description: `"${newPresetName}" preset has been created and activated.`
    });
  };

  const deletePreset = (presetId: string) => {
    if (presetId === 'default') return;
    
    const presetToDelete = presets.find(p => p.id === presetId);
    const updatedPresets = presets.filter(p => p.id !== presetId);
    const newActiveId = activePresetId === presetId ? 'default' : activePresetId;
    savePresets(updatedPresets, newActiveId);
    
    toast({
      title: "Preset deleted",
      description: `"${presetToDelete?.name}" preset has been deleted.`
    });
  };

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItem: MenuItem) => {
    e.preventDefault();
    if (!draggedItem || !activePreset || draggedItem.id === targetItem.id) return;

    const items = [...activePreset.items];
    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetItem.id);

    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    const updatedPresets = presets.map(preset => 
      preset.id === activePresetId 
        ? { ...preset, items }
        : preset
    );
    
    savePresets(updatedPresets);
    setDraggedItem(null);
    toast({
      title: "Order updated",
      description: "Sidebar item order has been changed."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Active Preset</Label>
            <Select value={activePresetId} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presets.map(preset => (
                  <SelectItem key={preset.id} value={preset.id}>
                    <div className="flex items-center gap-2">
                      {preset.isDefault && <Lock className="w-3 h-3" />}
                      {preset.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isDefaultPreset && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <Lock className="w-4 h-4 inline mr-1" />
              Default preset allows reordering but tabs cannot be disabled. Create a custom preset for full control.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="New preset name"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
          <Button onClick={createPreset} size="sm" disabled={!newPresetName.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {activePreset && (
          <div className="space-y-2">
            {activePreset.items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 p-3 border rounded-lg bg-background cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  {item.role && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({item.role.join(', ')})
                    </span>
                  )}
                </div>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={() => toggleItem(item.id)}
                  disabled={isDefaultPreset}
                />
                {isDefaultPreset && (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        )}

        {activePresetId !== 'default' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deletePreset(activePresetId)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Preset
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SidebarCustomizer;