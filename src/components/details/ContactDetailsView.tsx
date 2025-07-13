import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Save, X, Building } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';

const ContactDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { contacts, updateContact } = useContacts();
  const { companies } = useCompanies();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  
  const contact = contacts.find(c => c.id === id);
  const company = contact ? companies.find(c => c.id === contact.company_id) : null;
  
  if (!contact) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Contact Not Found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contacts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({ ...contact });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateContact(id!, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{contact.first_name} {contact.last_name}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label>First Name</Label>
                  <Input 
                    value={editData.first_name || ''} 
                    onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input 
                    value={editData.last_name || ''} 
                    onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input 
                    value={editData.title || ''} 
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input 
                    value={editData.phone || ''} 
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    value={editData.email || ''} 
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea 
                    value={editData.contact_notes || ''} 
                    onChange={(e) => setEditData({...editData, contact_notes: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div><strong>First Name:</strong> {contact.first_name || 'Not specified'}</div>
                <div><strong>Last Name:</strong> {contact.last_name || 'Not specified'}</div>
                <div><strong>Title:</strong> {contact.title || 'Not specified'}</div>
                <div><strong>Phone:</strong> {contact.phone || 'Not specified'}</div>
                <div><strong>Email:</strong> {contact.email || 'Not specified'}</div>
                <div><strong>LinkedIn:</strong> {contact.linkedin || 'Not specified'}</div>
                <div><strong>Birthday:</strong> {contact.birthday || 'Not specified'}</div>
                <div><strong>Status:</strong> {contact.status || 'Not specified'}</div>
                <div><strong>Primary Contact:</strong> {contact.is_primary_contact ? 'Yes' : 'No'}</div>
                <div><strong>Can Place Orders:</strong> {contact.can_place_orders ? 'Yes' : 'No'}</div>
                <div><strong>Notes:</strong> {contact.contact_notes || 'Not specified'}</div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            {company ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <Link to={`/companies/${company.id}`} className="font-medium text-blue-600 hover:underline">
                    {company.name}
                  </Link>
                </div>
                <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
                  {company.status}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Email:</strong> {company.main_email || 'Not specified'}</p>
                  <p><strong>Phone:</strong> {company.main_phone || 'Not specified'}</p>
                  <p><strong>Address:</strong> {company.street_address || 'Not specified'}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No company associated</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetailsView;