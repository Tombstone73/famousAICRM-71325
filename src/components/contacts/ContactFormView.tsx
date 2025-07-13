import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { ContactBasicInfo } from './ContactBasicInfo';
import { ContactCommunication } from './ContactCommunication';
import { ContactRoles } from './ContactRoles';
import { ContactNotes } from './ContactNotes';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';
import { Contact } from '@/types';

export function ContactFormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, addContact, updateContact } = useContacts();
  const { companies } = useCompanies();
  const [contact, setContact] = useState<Contact>({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    company_id: '',
    contact_status: 'Active',
    is_primary_contact: false,
    is_billing_contact: false,
    is_technical_contact: false,
    is_authorized_to_place_orders: false,
    order_update_notifications: true,
    preferred_contact_method: 'Email',
    best_time_to_reach: 'Anytime',
    preferred_file_delivery: 'Email',
    additional_emails: [],
    custom_tags: [],
    interaction_log: []
  });

  const isEditing = id !== 'new';
  const existingContact = contacts.find(c => c.id === id);

  useEffect(() => {
    if (isEditing && existingContact) {
      setContact(existingContact);
    }
  }, [isEditing, existingContact]);

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateContact(contact.id, contact);
      } else {
        const newContact = {
          ...contact,
          id: Date.now().toString(),
          date_added: new Date().toISOString(),
          added_by: 'Current User'
        };
        await addContact(newContact);
      }
      navigate('/contacts');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleContactChange = (updates: Partial<Contact>) => {
    setContact(prev => ({ ...prev, ...updates }));
  };

  const isValid = contact.first_name && contact.last_name && contact.email && contact.company_id;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Contact' : 'Add New Contact'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update contact information' : 'Create a new contact profile'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={!isValid}>
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="roles">Roles & Tags</TabsTrigger>
          <TabsTrigger value="notes">Notes & Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactBasicInfo
                contact={contact}
                companies={companies}
                isEditing={true}
                onContactChange={handleContactChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card>
            <CardHeader>
              <CardTitle>Communication Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactCommunication
                contact={contact}
                isEditing={true}
                onContactChange={handleContactChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactRoles
                contact={contact}
                isEditing={true}
                onContactChange={handleContactChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes & Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactNotes
                contact={contact}
                isEditing={true}
                onContactChange={handleContactChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {!isValid && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please fill in all required fields: First Name, Last Name, Email, and Company.
          </p>
        </div>
      )}
    </div>
  );
}