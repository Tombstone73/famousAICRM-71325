import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X } from 'lucide-react';
import { GeneralInfo } from './CompanyFormSections';
import { CommunicationSection } from './CommunicationSection';
import { FinancialSection } from './FinancialSection';
import { NotesSection } from './NotesSection';

interface Company {
  id: string;
  name: string;
  type: 'B2B' | 'B2C';
  status: 'Active' | 'Inactive' | 'Prospect';
  industry?: string;
  main_phone?: string;
  main_email?: string;
  website?: string;
  billing_emails?: string[];
  shipping_emails?: string[];
  order_notes_email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  payment_terms?: string;
  tax_exempt?: boolean;
  tax_id?: string;
  default_discount_percent?: number;
  custom_pricing_rules?: boolean;
  internal_notes?: string;
  display_priority?: number;
  tags?: string[];
}

interface CompanyFormProps {
  company?: Company;
  onSave: (company: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ company, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: company?.name || '',
    type: company?.type || 'B2B' as const,
    status: company?.status || 'Active' as const,
    industry: company?.industry || '',
    main_phone: company?.main_phone || '',
    main_email: company?.main_email || '',
    website: company?.website || '',
    billing_emails: company?.billing_emails?.length ? company.billing_emails : [''],
    shipping_emails: company?.shipping_emails || [],
    order_notes_email: company?.order_notes_email || '',
    street_address: company?.street_address || '',
    city: company?.city || '',
    state: company?.state || '',
    zip_code: company?.zip_code || '',
    country: company?.country || 'USA',
    payment_terms: company?.payment_terms || '',
    tax_exempt: company?.tax_exempt || false,
    tax_id: company?.tax_id || '',
    default_discount_percent: company?.default_discount_percent || 0,
    custom_pricing_rules: company?.custom_pricing_rules || false,
    internal_notes: company?.internal_notes || '',
    display_priority: company?.display_priority || 0,
    tags: company?.tags || []
  });

  const [openSections, setOpenSections] = useState({
    general: true,
    communication: true,
    financial: false,
    notes: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);
    
    if (!formData.name.trim()) {
      alert('Company name is required');
      return false;
    }
    
    // Check if at least one billing email is provided and valid
    const validBillingEmails = formData.billing_emails
      .filter(email => email && email.trim() !== '')
      .filter(email => isValidEmail(email));
    
    console.log('All billing emails:', formData.billing_emails);
    console.log('Valid billing emails:', validBillingEmails);
    
    if (validBillingEmails.length === 0) {
      alert('At least one valid billing email is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      return;
    }
    
    const cleanedData = {
      ...formData,
      billing_emails: formData.billing_emails.filter(email => email && email.trim() !== ''),
      shipping_emails: formData.shipping_emails.filter(email => email && email.trim() !== '')
    };
    
    console.log('Cleaned data being saved:', cleanedData);
    onSave(cleanedData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{company ? 'Edit Company' : 'Add New Company'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Collapsible open={openSections.general} onOpenChange={() => toggleSection('general')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 font-medium">
              General Information
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.general ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <GeneralInfo formData={formData} setFormData={setFormData} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible open={openSections.communication} onOpenChange={() => toggleSection('communication')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 font-medium">
              Communication & Contacts
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.communication ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <CommunicationSection formData={formData} setFormData={setFormData} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 font-medium">
              Financial
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.financial ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <FinancialSection formData={formData} setFormData={setFormData} />
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible open={openSections.notes} onOpenChange={() => toggleSection('notes')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 font-medium">
              Notes & Files
              <ChevronDown className={`w-4 h-4 transition-transform ${openSections.notes ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <NotesSection formData={formData} setFormData={setFormData} />
            </CollapsibleContent>
          </Collapsible>

          <div className="flex justify-end space-x-2 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {company ? 'Update' : 'Create'} Company
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;