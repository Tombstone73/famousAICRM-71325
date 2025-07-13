import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Plus, Filter, Mail, Phone, Building2 } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';
import { Contact } from '@/types';

export function ContactListView() {
  const navigate = useNavigate();
  const { contacts } = useContacts();
  const { companies } = useCompanies();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const getContactName = (contact: Contact) => {
    const firstName = contact.first_name || '';
    const lastName = contact.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || contact.name || 'Unknown Contact';
  };

  const filteredContacts = contacts.filter(contact => {
    const name = getContactName(contact).toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const title = (contact.title || '').toLowerCase();
    const companyName = companies.find(c => c.id === contact.company_id)?.name?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || email.includes(search) || title.includes(search) || companyName.includes(search);
    const matchesStatus = statusFilter === 'all' || contact.contact_status === statusFilter;
    
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'primary' && contact.is_primary_contact) ||
      (roleFilter === 'billing' && contact.is_billing_contact) ||
      (roleFilter === 'technical' && contact.is_technical_contact) ||
      (roleFilter === 'orders' && contact.is_authorized_to_place_orders);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Do Not Contact': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (contact: Contact) => {
    const firstName = contact.first_name || '';
    const lastName = contact.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'UC';
  };

  const getRoleBadges = (contact: Contact) => {
    const roles = [];
    if (contact.is_primary_contact) roles.push('Primary');
    if (contact.is_billing_contact) roles.push('Billing');
    if (contact.is_technical_contact) roles.push('Technical');
    if (contact.is_authorized_to_place_orders) roles.push('Orders');
    return roles;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-gray-600">{filteredContacts.length} contacts found</p>
        </div>
        <Button onClick={() => navigate('/contacts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contacts, companies, titles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="primary">Primary Contact</SelectItem>
                <SelectItem value="billing">Billing Contact</SelectItem>
                <SelectItem value="technical">Technical Contact</SelectItem>
                <SelectItem value="orders">Order Authorization</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredContacts.map((contact) => {
          const company = companies.find(c => c.id === contact.company_id);
          const roles = getRoleBadges(contact);
          const contactName = getContactName(contact);
          
          return (
            <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/contacts/${contact.id}`)}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(contact)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {contactName}
                        </h3>
                        <Badge className={getStatusColor(contact.contact_status || 'Active')}>
                          {contact.contact_status || 'Active'}
                        </Badge>
                      </div>
                      
                      {contact.title && (
                        <p className="text-gray-600 mb-1">{contact.title}</p>
                      )}
                      
                      {company && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                          <Building2 className="h-4 w-4" />
                          {company.name}
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-600">
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {contact.email}
                          </div>
                        )}
                        {(contact.mobile_phone || contact.phone || contact.work_phone) && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {contact.mobile_phone || contact.phone || contact.work_phone}
                          </div>
                        )}
                      </div>
                      
                      {roles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {roles.map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {contact.custom_tags && contact.custom_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {contact.custom_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.custom_tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{contact.custom_tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
          <Button onClick={() => navigate('/contacts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Contact
          </Button>
        </div>
      )}
    </div>
  );
}