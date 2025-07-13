import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';

interface CompanyNotesSectionProps {
  company: any;
  isEditing: boolean;
  editData: any;
  handleInputChange: (field: string, value: any) => void;
}

export const CompanyNotesSection: React.FC<CompanyNotesSectionProps> = ({
  company,
  isEditing,
  editData,
  handleInputChange
}) => {
  const addTag = (tagText: string) => {
    if (tagText.trim() && !editData.tags?.includes(tagText.trim())) {
      handleInputChange('tags', [...(editData.tags || []), tagText.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', editData.tags?.filter((tag: string) => tag !== tagToRemove) || []);
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
    <Card>
      <CardHeader>
        <CardTitle>Notes & Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <Label htmlFor="internal_notes">Internal Notes</Label>
              <Textarea
                id="internal_notes"
                value={editData.internal_notes || ''}
                onChange={(e) => handleInputChange('internal_notes', e.target.value)}
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
                value={editData.display_priority || ''}
                onChange={(e) => handleInputChange('display_priority', parseInt(e.target.value) || 0)}
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
                {editData.tags?.map((tag: string, index: number) => (
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
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Internal Notes:</span>
              <span className="text-sm">{company.internal_notes || 'No notes'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="font-semibold min-w-[140px]">Display Priority:</span>
              <span>{company.display_priority || '0'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {company.tags?.length > 0 ? (
                  company.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No tags</span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};