import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('first_name');
      
      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Validate user authentication
      if (!user?.id) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to create a contact.',
          variant: 'destructive'
        });
        throw new Error('User not authenticated');
      }
      
      // Map form data to database columns - only use columns that exist
      const contactData = {
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
        phone: contact.phone || null,
        status: contact.status || 'Active',
        roles: contact.roles || [],
        is_primary_contact: contact.is_primary_contact || false,
        can_place_orders: contact.can_place_orders !== false,
        can_receive_updates: contact.can_receive_updates !== false,
        title: contact.title || null,
        birthday: contact.birthday || null,
        linkedin: contact.linkedin || null,
        company_id: contact.company_id || null,
        job_start_date: contact.job_start_date || null,
        contact_notes: contact.contact_notes || null,
        role: contact.title || null, // Map title to role field
        notes: contact.contact_notes || null, // Map to notes field
        created_by: user.id // Use actual user UUID
      };

      console.log('Creating contact with data:', contactData);

      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create contact: ${error.message}`);
      }
      
      setContacts(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contact';
      setError(errorMessage);
      console.error('Create contact error:', err);
      toast({
        title: 'Error',
        description: `Failed to create contact: ${errorMessage}`,
        variant: 'destructive'
      });
      throw new Error(errorMessage);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const updateData: any = { ...updates };
      
      // Map title to role field
      if (updates.title !== undefined) {
        updateData.role = updates.title;
      }
      
      // Map contact_notes to notes field
      if (updates.contact_notes !== undefined) {
        updateData.notes = updates.contact_notes;
      }

      const { data, error } = await supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setContacts(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to update contact: ${errorMessage}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `Failed to delete contact: ${errorMessage}`,
        variant: 'destructive'
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refetch: fetchContacts
  };
};