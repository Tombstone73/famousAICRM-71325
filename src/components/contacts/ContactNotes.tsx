import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Contact } from '@/types';
import { useState } from 'react';

interface ContactNotesProps {
  contact: Contact;
  isEditing: boolean;
  onContactChange: (updates: Partial<Contact>) => void;
}

export function ContactNotes({ contact, isEditing, onContactChange }: ContactNotesProps) {
  const [newInteraction, setNewInteraction] = useState('');

  const addInteraction = () => {
    if (newInteraction.trim()) {
      const currentLog = contact.interaction_log || [];
      const newEntry = {
        date: new Date().toISOString(),
        note: newInteraction.trim(),
        user: 'Current User' // In real app, get from auth context
      };
      onContactChange({ interaction_log: [newEntry, ...currentLog] });
      setNewInteraction('');
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Office/Branch Name</Label>
            <p className="text-sm">{contact.office_branch_name || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Time Zone</Label>
            <p className="text-sm">{contact.time_zone || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Preferred File Delivery</Label>
            <p className="text-sm">{contact.preferred_file_delivery || 'Email'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">T-shirt Size</Label>
            <p className="text-sm">{contact.tshirt_size || 'Not specified'}</p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Birthday</Label>
          <p className="text-sm">{contact.birthday || 'Not specified'}</p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Favorite Print Type</Label>
          <p className="text-sm">{contact.favorite_print_type || 'Not specified'}</p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Shipping Address Override</Label>
          <p className="text-sm whitespace-pre-wrap">{contact.shipping_address_override || 'Uses company address'}</p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Internal Notes</Label>
          <p className="text-sm whitespace-pre-wrap">{contact.internal_notes || 'No notes'}</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded border ${contact.order_update_notifications ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}></div>
          <span className="text-sm">Receives Order Update Notifications</span>
        </div>

        {contact.interaction_log && contact.interaction_log.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-600 mb-3 block">Recent Interactions</Label>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {contact.interaction_log.map((interaction, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-gray-500">{interaction.user}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(interaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{interaction.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="office_branch_name">Office/Branch Name</Label>
          <Input
            id="office_branch_name"
            value={contact.office_branch_name || ''}
            onChange={(e) => onContactChange({ office_branch_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="time_zone">Time Zone</Label>
          <Input
            id="time_zone"
            value={contact.time_zone || ''}
            onChange={(e) => onContactChange({ time_zone: e.target.value })}
            placeholder="e.g., EST, PST, GMT"
          />
        </div>
        <div>
          <Label htmlFor="preferred_file_delivery">Preferred File Delivery</Label>
          <Select value={contact.preferred_file_delivery || 'Email'} onValueChange={(value) => onContactChange({ preferred_file_delivery: value as any })}>
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
          <Label htmlFor="tshirt_size">T-shirt Size</Label>
          <Select value={contact.tshirt_size || ''} onValueChange={(value) => onContactChange({ tshirt_size: value as any })}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
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
        <Label htmlFor="birthday">Birthday</Label>
        <Input
          id="birthday"
          type="date"
          value={contact.birthday || ''}
          onChange={(e) => onContactChange({ birthday: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="favorite_print_type">Favorite Print Type</Label>
        <Input
          id="favorite_print_type"
          value={contact.favorite_print_type || ''}
          onChange={(e) => onContactChange({ favorite_print_type: e.target.value })}
          placeholder="e.g., Digital, Offset, Screen Print"
        />
      </div>

      <div>
        <Label htmlFor="shipping_address_override">Shipping Address Override</Label>
        <Textarea
          id="shipping_address_override"
          value={contact.shipping_address_override || ''}
          onChange={(e) => onContactChange({ shipping_address_override: e.target.value })}
          placeholder="Leave blank to use company address"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="internal_notes">Internal Notes</Label>
        <Textarea
          id="internal_notes"
          value={contact.internal_notes || ''}
          onChange={(e) => onContactChange({ internal_notes: e.target.value })}
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="order_update_notifications"
          checked={contact.order_update_notifications !== false}
          onCheckedChange={(checked) => onContactChange({ order_update_notifications: !!checked })}
        />
        <Label htmlFor="order_update_notifications">Receives Order Update Notifications</Label>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Add Interaction</Label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add interaction note..."
            value={newInteraction}
            onChange={(e) => setNewInteraction(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInteraction()}
          />
          <Button type="button" variant="outline" onClick={addInteraction}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {contact.interaction_log && contact.interaction_log.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {contact.interaction_log.slice(0, 5).map((interaction, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">{interaction.user}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(interaction.date).toLocaleDateString()}
                  </span>
                </div>
                <p>{interaction.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}