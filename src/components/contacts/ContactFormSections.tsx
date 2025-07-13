import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Contact } from '@/types/index';

interface ContactFormSectionsProps {
  formData: Partial<Contact>;
  setFormData: (data: Partial<Contact>) => void;
  companies: any[];
  companiesLoading: boolean;
}

export const PersonalDetailsSection: React.FC<ContactFormSectionsProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Personal & Professional Details</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              id="birthday"
              type="date"
              value={formData.birthday || ''}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="job_start_date">Job Start Date</Label>
            <Input
              id="job_start_date"
              type="date"
              value={formData.job_start_date || ''}
              onChange={(e) => setFormData({ ...formData, job_start_date: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="office_branch_name">Office/Branch Name</Label>
            <Input
              id="office_branch_name"
              value={formData.office_branch_name || ''}
              onChange={(e) => setFormData({ ...formData, office_branch_name: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="time_zone">Time Zone</Label>
            <Input
              id="time_zone"
              value={formData.time_zone || ''}
              onChange={(e) => setFormData({ ...formData, time_zone: e.target.value })}
              placeholder="e.g., EST, PST, GMT"
            />
          </div>
          <div>
            <Label htmlFor="assigned_account_rep">Assigned Account Rep</Label>
            <Input
              id="assigned_account_rep"
              value={formData.assigned_account_rep || ''}
              onChange={(e) => setFormData({ ...formData, assigned_account_rep: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const PreferencesSection: React.FC<ContactFormSectionsProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Preferences & Settings</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Preferred File Delivery</Label>
            <Select 
              value={formData.preferred_file_delivery || 'Email'} 
              onValueChange={(value) => setFormData({ ...formData, preferred_file_delivery: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="WeTransfer">WeTransfer</SelectItem>
                <SelectItem value="Dropbox">Dropbox</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>T-Shirt Size</Label>
            <Select 
              value={formData.tshirt_size || 'M'} 
              onValueChange={(value) => setFormData({ ...formData, tshirt_size: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XS">XS</SelectItem>
                <SelectItem value="S">S</SelectItem>
                <SelectItem value="M">M</SelectItem>
                <SelectItem value="L">L</SelectItem>
                <SelectItem value="XL">XL</SelectItem>
                <SelectItem value="XXL">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="favorite_print_type">Favorite Print Type</Label>
          <Input
            id="favorite_print_type"
            value={formData.favorite_print_type || ''}
            onChange={(e) => setFormData({ ...formData, favorite_print_type: e.target.value })}
            placeholder="e.g., Screen Print, Embroidery, DTG"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="order_update_notifications"
            checked={formData.order_update_notifications || false}
            onCheckedChange={(checked) => setFormData({ ...formData, order_update_notifications: checked })}
          />
          <Label htmlFor="order_update_notifications">Receive Order Update Notifications</Label>
        </div>
      </div>
    </div>
  );
};

export const RolesPermissionsSection: React.FC<ContactFormSectionsProps> = ({ formData, setFormData }) => {
  return (
    <div>
      <h3 className="font-medium mb-4">Roles & Permissions</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_primary_contact"
              checked={formData.is_primary_contact || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_primary_contact: checked })}
            />
            <Label htmlFor="is_primary_contact">Primary Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_billing_contact"
              checked={formData.is_billing_contact || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_billing_contact: checked })}
            />
            <Label htmlFor="is_billing_contact">Billing Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_technical_contact"
              checked={formData.is_technical_contact || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_technical_contact: checked })}
            />
            <Label htmlFor="is_technical_contact">Technical Contact</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_authorized_to_place_orders"
              checked={formData.is_authorized_to_place_orders || false}
              onCheckedChange={(checked) => setFormData({ ...formData, is_authorized_to_place_orders: checked })}
            />
            <Label htmlFor="is_authorized_to_place_orders">Can Place Orders</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TagsNotesSection: React.FC<ContactFormSectionsProps> = ({ formData, setFormData }) => {
  const [newTag, setNewTag] = React.useState('');

  const addTag = () => {
    if (newTag.trim() && !(formData.custom_tags || []).includes(newTag.trim())) {
      setFormData({ 
        ...formData, 
        custom_tags: [...(formData.custom_tags || []), newTag.trim()] 
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      custom_tags: (formData.custom_tags || []).filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div>
      <h3 className="font-medium mb-4">Tags & Notes</h3>
      <div className="space-y-4">
        <div>
          <Label>Custom Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.custom_tags || []).map((tag, index) => (
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
        <div>
          <Label htmlFor="contact_notes">Contact Notes</Label>
          <Textarea
            id="contact_notes"
            value={formData.contact_notes || ''}
            onChange={(e) => setFormData({ ...formData, contact_notes: e.target.value })}
            rows={3}
            placeholder="Notes about this contact..."
          />
        </div>
        <div>
          <Label htmlFor="internal_notes">Internal Notes</Label>
          <Textarea
            id="internal_notes"
            value={formData.internal_notes || ''}
            onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
            rows={3}
            placeholder="Internal notes (not visible to contact)..."
          />
        </div>
      </div>
    </div>
  );
};