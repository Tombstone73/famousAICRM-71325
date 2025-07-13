import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { Contact } from '@/types';
import { useState } from 'react';

interface ContactRolesProps {
  contact: Contact;
  isEditing: boolean;
  onContactChange: (updates: Partial<Contact>) => void;
}

export function ContactRoles({ contact, isEditing, onContactChange }: ContactRolesProps) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (newTag.trim()) {
      const currentTags = contact.custom_tags || [];
      onContactChange({ custom_tags: [...currentTags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = contact.custom_tags || [];
    onContactChange({ custom_tags: currentTags.filter(tag => tag !== tagToRemove) });
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-600 mb-3 block">Account Roles</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border ${contact.is_primary_contact ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
              <span className="text-sm">Primary Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border ${contact.is_billing_contact ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
              <span className="text-sm">Billing Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border ${contact.is_technical_contact ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
              <span className="text-sm">Technical Contact</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded border ${contact.is_authorized_to_place_orders ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
              <span className="text-sm">Authorized to Place Orders</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Contact Status</Label>
            <p className="text-sm">{contact.contact_status || 'Active'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Assigned Account Rep</Label>
            <p className="text-sm">{contact.assigned_account_rep || 'Not assigned'}</p>
          </div>
        </div>

        {contact.custom_tags && contact.custom_tags.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-600 mb-2 block">Custom Tags</Label>
            <div className="flex flex-wrap gap-2">
              {contact.custom_tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Account Roles</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary_contact"
              checked={contact.is_primary_contact || false}
              onCheckedChange={(checked) => onContactChange({ is_primary_contact: !!checked })}
            />
            <Label htmlFor="is_primary_contact">Primary Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_billing_contact"
              checked={contact.is_billing_contact || false}
              onCheckedChange={(checked) => onContactChange({ is_billing_contact: !!checked })}
            />
            <Label htmlFor="is_billing_contact">Billing Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_technical_contact"
              checked={contact.is_technical_contact || false}
              onCheckedChange={(checked) => onContactChange({ is_technical_contact: !!checked })}
            />
            <Label htmlFor="is_technical_contact">Technical Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_authorized_to_place_orders"
              checked={contact.is_authorized_to_place_orders || false}
              onCheckedChange={(checked) => onContactChange({ is_authorized_to_place_orders: !!checked })}
            />
            <Label htmlFor="is_authorized_to_place_orders">Authorized to Place Orders</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact_status">Contact Status</Label>
          <Select value={contact.contact_status || 'Active'} onValueChange={(value) => onContactChange({ contact_status: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assigned_account_rep">Assigned Account Rep</Label>
          <Input
            id="assigned_account_rep"
            value={contact.assigned_account_rep || ''}
            onChange={(e) => onContactChange({ assigned_account_rep: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-2 block">Custom Tags</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {contact.custom_tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}