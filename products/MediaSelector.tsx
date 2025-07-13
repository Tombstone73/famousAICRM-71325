import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaInventory } from '@/hooks/useMediaInventory';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface MediaSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function MediaSelector({
  value,
  onValueChange,
  label = 'Media Type',
  placeholder = 'Select media type...',
  required = false
}: MediaSelectorProps) {
  const { data: mediaData, isLoading, error } = useMediaInventory();

  if (error) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2 p-3 border rounded-md bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">Failed to load media types</span>
        </div>
      </div>
    );
  }

  const selectedMedia = mediaData?.types.find(type => type.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {required && <Badge variant="destructive" className="text-xs">Required</Badge>}
      </div>
      
      <Select value={value || ''} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {mediaData?.types.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              <div className="flex flex-col">
                <span className="font-medium">{type.name}</span>
                {type.description && (
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedMedia && (
        <div className="text-sm text-muted-foreground">
          Selected: {selectedMedia.name}
          {selectedMedia.description && ` - ${selectedMedia.description}`}
        </div>
      )}
    </div>
  );
}