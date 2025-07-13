import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface CommunicationSectionProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const CommunicationSection: React.FC<CommunicationSectionProps> = ({ formData, setFormData }) => {
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addBillingEmail = () => {
    setFormData({
      ...formData,
      billing_emails: [...(formData.billing_emails || []), '']
    });
  };

  const removeBillingEmail = (index: number) => {
    const emails = [...(formData.billing_emails || [])];
    emails.splice(index, 1);
    // Ensure at least one billing email field remains
    if (emails.length === 0) {
      emails.push('');
    }
    setFormData({ ...formData, billing_emails: emails });
  };

  const updateBillingEmail = (index: number, value: string) => {
    const emails = [...(formData.billing_emails || [])];
    emails[index] = value;
    setFormData({ ...formData, billing_emails: emails });
  };

  const addShippingEmail = () => {
    setFormData({
      ...formData,
      shipping_emails: [...(formData.shipping_emails || []), '']
    });
  };

  const removeShippingEmail = (index: number) => {
    const emails = [...(formData.shipping_emails || [])];
    emails.splice(index, 1);
    setFormData({ ...formData, shipping_emails: emails });
  };

  const updateShippingEmail = (index: number, value: string) => {
    const emails = [...(formData.shipping_emails || [])];
    emails[index] = value;
    setFormData({ ...formData, shipping_emails: emails });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="main_phone">Main Phone</Label>
          <Input
            id="main_phone"
            value={formData.main_phone}
            onChange={(e) => setFormData({ ...formData, main_phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="main_email">Main Email</Label>
          <Input
            id="main_email"
            type="email"
            value={formData.main_email}
            onChange={(e) => setFormData({ ...formData, main_email: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Billing Emails *</Label>
          <Button type="button" variant="outline" size="sm" onClick={addBillingEmail}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {(formData.billing_emails || ['']).map((email: string, index: number) => {
          const hasValue = email && email.trim() !== '';
          const isValid = hasValue ? isValidEmail(email) : true;
          const showError = hasValue && !isValid;
          
          return (
            <div key={index} className="mb-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => updateBillingEmail(index, e.target.value)}
                  placeholder="billing@company.com"
                  className={showError ? 'border-red-500' : ''}
                />
                {formData.billing_emails?.length > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeBillingEmail(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {showError && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>
          );
        })}
        <p className="text-sm text-muted-foreground mt-1">
          At least one billing email is required
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Shipping Emails</Label>
          <Button type="button" variant="outline" size="sm" onClick={addShippingEmail}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {(formData.shipping_emails || []).map((email: string, index: number) => {
          const hasValue = email && email.trim() !== '';
          const isValid = hasValue ? isValidEmail(email) : true;
          const showError = hasValue && !isValid;
          
          return (
            <div key={index} className="mb-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => updateShippingEmail(index, e.target.value)}
                  placeholder="shipping@company.com"
                  className={showError ? 'border-red-500' : ''}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeShippingEmail(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {showError && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <Label htmlFor="order_notes_email">Order Notes Default Email</Label>
        <Input
          id="order_notes_email"
          type="email"
          value={formData.order_notes_email}
          onChange={(e) => setFormData({ ...formData, order_notes_email: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          placeholder="Street Address"
          value={formData.street_address}
          onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
          <Input
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          />
          <Input
            placeholder="ZIP"
            value={formData.zip_code}
            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
          />
        </div>
        <Input
          placeholder="Country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        />
      </div>
    </div>
  );
};