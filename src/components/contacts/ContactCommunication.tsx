import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Contact } from '@/types';

interface ContactCommunicationProps {
  contact: Contact;
  isEditing: boolean;
  onContactChange: (updates: Partial<Contact>) => void;
}

export function ContactCommunication({ contact, isEditing, onContactChange }: ContactCommunicationProps) {
  const addAdditionalEmail = () => {
    const currentEmails = contact.additional_emails || [];
    onContactChange({
      additional_emails: [...currentEmails, { email: '', is_billing: false, is_order_updates: false }]
    });
  };

  const removeAdditionalEmail = (index: number) => {
    const currentEmails = contact.additional_emails || [];
    onContactChange({
      additional_emails: currentEmails.filter((_, i) => i !== index)
    });
  };

  const updateAdditionalEmail = (index: number, updates: Partial<{ email: string; is_billing: boolean; is_order_updates: boolean }>) => {
    const currentEmails = contact.additional_emails || [];
    const updatedEmails = currentEmails.map((email, i) => 
      i === index ? { ...email, ...updates } : email
    );
    onContactChange({ additional_emails: updatedEmails });
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">Primary Email</Label>
            <p className="text-sm">{contact.email || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Mobile Phone</Label>
            <p className="text-sm">{contact.mobile_phone || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Work Phone</Label>
            <p className="text-sm">{contact.work_phone || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Preferred Contact Method</Label>
            <p className="text-sm">{contact.preferred_contact_method || 'Email'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Best Time to Reach</Label>
            <p className="text-sm">{contact.best_time_to_reach || 'Anytime'}</p>
          </div>
        </div>
        {contact.additional_emails && contact.additional_emails.length > 0 && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Additional Emails</Label>
            <div className="space-y-2 mt-2">
              {contact.additional_emails.map((email, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  <p>{email.email}</p>
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">
                    {email.is_billing && <span>• Billing Contact</span>}
                    {email.is_order_updates && <span>• Order Updates</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Primary Email</Label>
          <Input
            id="email"
            type="email"
            value={contact.email || ''}
            onChange={(e) => onContactChange({ email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="mobile_phone">Mobile Phone</Label>
          <Input
            id="mobile_phone"
            value={contact.mobile_phone || ''}
            onChange={(e) => onContactChange({ mobile_phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="work_phone">Work Phone</Label>
          <Input
            id="work_phone"
            value={contact.work_phone || ''}
            onChange={(e) => onContactChange({ work_phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="preferred_contact_method">Preferred Contact Method</Label>
          <Select value={contact.preferred_contact_method || 'Email'} onValueChange={(value) => onContactChange({ preferred_contact_method: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="best_time_to_reach">Best Time to Reach</Label>
          <Select value={contact.best_time_to_reach || 'Anytime'} onValueChange={(value) => onContactChange({ best_time_to_reach: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
              <SelectItem value="Anytime">Anytime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Additional Emails</Label>
          <Button type="button" variant="outline" size="sm" onClick={addAdditionalEmail}>
            <Plus className="h-4 w-4 mr-1" /> Add Email
          </Button>
        </div>
        {contact.additional_emails?.map((email, index) => (
          <div key={index} className="flex items-center gap-2 mb-2 p-3 border rounded">
            <div className="flex-1">
              <Input
                placeholder="Email address"
                value={email.email}
                onChange={(e) => updateAdditionalEmail(index, { email: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`billing-${index}`}
                checked={email.is_billing}
                onCheckedChange={(checked) => updateAdditionalEmail(index, { is_billing: !!checked })}
              />
              <Label htmlFor={`billing-${index}`} className="text-xs">Billing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`orders-${index}`}
                checked={email.is_order_updates}
                onCheckedChange={(checked) => updateAdditionalEmail(index, { is_order_updates: !!checked })}
              />
              <Label htmlFor={`orders-${index}`} className="text-xs">Orders</Label>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeAdditionalEmail(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}