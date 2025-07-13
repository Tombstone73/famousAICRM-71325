import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Edit } from 'lucide-react';
import { Contact } from '@/types';

interface CompanyContactsListProps {
  contacts: Contact[];
  onEditContact: (contact: Contact) => void;
}

const CompanyContactsList: React.FC<CompanyContactsListProps> = ({ contacts, onEditContact }) => {
  if (contacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No contacts found for this company.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Contacts ({contacts.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Link to={`/contacts/${contact.id}`} className="hover:underline">
                    <h4 className="font-medium text-blue-600">{contact.first_name} {contact.last_name}</h4>
                  </Link>
                  {contact.is_primary_contact && (
                    <Badge variant="default">Primary</Badge>
                  )}
                  <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                    {contact.status}
                  </Badge>
                </div>
                
                {contact.title && (
                  <p className="text-sm text-gray-600">{contact.title}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
                
                {contact.roles && contact.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {contact.roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={() => onEditContact(contact)}>
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CompanyContactsList;