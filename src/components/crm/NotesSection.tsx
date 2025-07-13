import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';

interface NotesSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ formData, setFormData }) => {
  const addTag = (tagText: string) => {
    if (tagText.trim() && !formData.tags?.includes(tagText.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagText.trim()]
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag: string) => tag !== tagToRemove) || []
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      addTag(input.value);
      input.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="internal_notes">Internal Notes</Label>
        <Textarea
          id="internal_notes"
          value={formData.internal_notes}
          onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
          rows={4}
          placeholder="Internal notes about this company..."
        />
      </div>

      <div>
        <Label>Attachments</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Upload files (PDF, DOC, XLS, JPG, PNG)
          </p>
          <Button variant="outline" size="sm">
            Choose Files
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="display_priority">Display Priority</Label>
        <Input
          id="display_priority"
          type="number"
          value={formData.display_priority}
          onChange={(e) => setFormData({ ...formData, display_priority: parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Higher numbers appear first in dropdowns
        </p>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          placeholder="Type a tag and press Enter (e.g., reseller, government, nonprofit)"
          onKeyPress={handleTagKeyPress}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};