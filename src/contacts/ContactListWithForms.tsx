import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Settings, Building2 } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useCompanies } from '@/hooks/useCompanies';
import ContactForm from './ContactForm';
import { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ColumnManager, Column } from '@/components/crm/ColumnManager';

const ContactListWithForms: React.FC = () => {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const { companies } = useCompanies();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [showColumnManager, setShowColumnManager] = useState(false);
  
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'phone', label: 'Phone', visible: true },
    { id: 'role', label: 'Role', visible: true },
    { id: 'company', label: 'Company', visible: true },
    { id: 'actions', label: 'Actions', visible: true }
  ]);

  const getContactName = (contact: Contact) => {
    if (contact.first_name || contact.last_name) {
      return `${contact.first_name || ''} ${contact.last_name || ''}`.trim();
    }
    return contact.name || 'Unknown';
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'No Company';
  };

  const filteredContacts = contacts.filter(contact => {
    const name = getContactName(contact).toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const handleSave = async (contactData: Partial<Contact>) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.id, contactData);
        toast({ title: 'Contact updated successfully' });
      } else {
        await addContact(contactData as Omit<Contact, 'id'>);
        toast({ title: 'Contact created successfully' });
      }
      setShowForm(false);
      setEditingContact(undefined);
    } catch (error) {
      toast({ title: 'Error saving contact', variant: 'destructive' });
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast({ title: 'Contact deleted successfully' });
      } catch (error) {
        toast({ title: 'Error deleting contact', variant: 'destructive' });
      }
    }
  };

  const visibleColumns = columns.filter(col => col.visible);

  if (showForm) {
    return (
      <ContactForm
        contact={editingContact}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingContact(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowColumnManager(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Columns
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
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

      {loading ? (
        <div>Loading contacts...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead key={column.id}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {column.id === 'name' && getContactName(contact)}
                      {column.id === 'email' && (contact.email || 'No email')}
                      {column.id === 'phone' && (contact.phone || contact.work_phone || contact.mobile_phone || '-')}
                      {column.id === 'role' && (
                        <div className="flex items-center gap-2">
                          {contact.title && (
                            <Badge variant="secondary">{contact.title}</Badge>
                          )}
                          {contact.is_primary_contact && (
                            <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                          )}
                        </div>
                      )}
                      {column.id === 'company' && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          {contact.company_id ? getCompanyName(contact.company_id) : 'No Company'}
                        </div>
                      )}
                      {column.id === 'actions' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(contact)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(contact.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ColumnManager
        open={showColumnManager}
        onOpenChange={setShowColumnManager}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
};

export default ContactListWithForms;