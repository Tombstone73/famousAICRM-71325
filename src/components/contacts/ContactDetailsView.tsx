import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, ArrowLeft, Building2 } from 'lucide-react';
import { ContactBasicInfo } from './ContactBasicInfo';
import { ContactCommunication } from './ContactCommunication';
import { ContactRoles } from './ContactRoles';
import { ContactNotes } from './ContactNotes';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';
import { Contact } from '@/types';

export function ContactDetailsView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, updateContact } = useContacts();
  const { companies } = useCompanies();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Contact | null>(null);

  const contact = contacts.find(c => c.id === id);
  const company = contact ? companies.find(c => c.id === contact.company_id) : null;

  useEffect(() => {
    if (contact) {
      setEditedContact(contact);
    }
  }, [contact]);

  if (!contact || !editedContact) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Contact Not Found</h2>
          <p className="text-gray-600 mb-4">The contact you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/contacts')}>Back to Contacts</Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateContact(editedContact.id, editedContact);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  const handleContactChange = (updates: Partial<Contact>) => {
    setEditedContact(prev => prev ? { ...prev, ...updates } : null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Do Not Contact': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              {editedContact.first_name} {editedContact.last_name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(editedContact.contact_status || 'Active')}>
                {editedContact.contact_status || 'Active'}
              </Badge>
              {company && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/companies/${company.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  {company.name}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Contact
            </Button>
          )}
        </div>
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
                contact={editedContact}
                companies={companies}
                isEditing={isEditing}
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
                contact={editedContact}
                isEditing={isEditing}
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
                contact={editedContact}
                isEditing={isEditing}
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
                contact={editedContact}
                isEditing={isEditing}
                onContactChange={handleContactChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}