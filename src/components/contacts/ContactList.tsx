import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Mail, Phone, Building2, Calendar, Linkedin } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';

const ContactList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { contacts, loading } = useContacts();
  const { companies } = useCompanies();

  const getCompanyName = (companyId: string | null) => {
    if (!companyId) return 'No Company';
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Unknown Company';
  };

  const getContactName = (contact: any) => {
    // Handle the actual database structure
    const firstName = contact.first_name || '';
    const lastName = contact.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Return the full name if we have at least one name part, otherwise fallback
    return fullName || contact.name || 'Unknown Contact';
  };

  const filteredContacts = contacts.filter(contact => {
    const name = getContactName(contact).toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Primary': return 'bg-blue-100 text-blue-800';
      case 'Decision Maker': return 'bg-green-100 text-green-800';
      case 'Billing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6">Loading contacts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{getContactName(contact)}</h3>
                    <Badge className={getRoleBadgeColor(contact.role || contact.title || 'Contact')}>
                      {contact.role || contact.title || 'Contact'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{getCompanyName(contact.company_id)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{contact.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone || contact.mobile_phone || contact.work_phone || 'No phone'}</span>
                    </div>
                    {contact.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        <span className="text-blue-600">{contact.linkedin}</span>
                      </div>
                    )}
                    {contact.birthday && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Birthday: {new Date(contact.birthday).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;