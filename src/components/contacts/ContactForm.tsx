import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { Contact } from '@/types/index';
import { PersonalDetailsSection, PreferencesSection, RolesPermissionsSection, TagsNotesSection } from './ContactFormSections';

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSave, onCancel }) => {
  const { companies, loading: companiesLoading } = useCompanies();
  const [formData, setFormData] = useState({
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    mobile_phone: contact?.mobile_phone || '',
    work_phone: contact?.work_phone || '',
    status: contact?.status || 'Active',
    roles: contact?.roles || [],
    is_primary_contact: contact?.is_primary_contact || false,
    can_place_orders: contact?.can_place_orders || true,
    can_receive_updates: contact?.can_receive_updates || true,
    title: contact?.title || '',
    department: contact?.department || '',
    birthday: contact?.birthday || '',
    linkedin: contact?.linkedin || '',
    company_id: contact?.company_id || '',
    job_start_date: contact?.job_start_date || '',
    contact_notes: contact?.contact_notes || '',
    preferred_contact_method: contact?.preferred_contact_method || 'Email',
    best_time_to_reach: contact?.best_time_to_reach || 'Anytime',
    office_branch_name: contact?.office_branch_name || '',
    time_zone: contact?.time_zone || '',
    is_billing_contact: contact?.is_billing_contact || false,
    is_technical_contact: contact?.is_technical_contact || false,
    assigned_account_rep: contact?.assigned_account_rep || '',
    custom_tags: contact?.custom_tags || [],
    internal_notes: contact?.internal_notes || '',
    preferred_file_delivery: contact?.preferred_file_delivery || 'Email',
    order_update_notifications: contact?.order_update_notifications || true,
    tshirt_size: contact?.tshirt_size || 'M',
    favorite_print_type: contact?.favorite_print_type || '',
    additional_emails: contact?.additional_emails || [],
    is_authorized_to_place_orders: contact?.is_authorized_to_place_orders || false,
    contact_status: contact?.contact_status || 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Title/Position</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>Company</Label>
              <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={companiesLoading ? "Loading companies..." : "Select company (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Primary Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile_phone">Mobile Phone</Label>
                  <Input
                    id="mobile_phone"
                    value={formData.mobile_phone}
                    onChange={(e) => setFormData({ ...formData, mobile_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="work_phone">Work Phone</Label>
                  <Input
                    id="work_phone"
                    value={formData.work_phone}
                    onChange={(e) => setFormData({ ...formData, work_phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Contact Method</Label>
                  <Select value={formData.preferred_contact_method} onValueChange={(value) => setFormData({ ...formData, preferred_contact_method: value })}>
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
                  <Label>Best Time to Reach</Label>
                  <Select value={formData.best_time_to_reach} onValueChange={(value) => setFormData({ ...formData, best_time_to_reach: value })}>
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
            </div>
          </div>

          <Separator />
          <PersonalDetailsSection formData={formData} setFormData={setFormData} companies={companies} companiesLoading={companiesLoading} />
          
          <Separator />
          <RolesPermissionsSection formData={formData} setFormData={setFormData} companies={companies} companiesLoading={companiesLoading} />
          
          <Separator />
          <PreferencesSection formData={formData} setFormData={setFormData} companies={companies} companiesLoading={companiesLoading} />
          
          <Separator />
          <TagsNotesSection formData={formData} setFormData={setFormData} companies={companies} companiesLoading={companiesLoading} />

          <div className="flex justify-end space-x-2 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {contact ? 'Update' : 'Create'} Contact
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;