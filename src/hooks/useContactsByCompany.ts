import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/types';

export const useContactsByCompany = (companyId: string | null) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContactsByCompany = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('company_id', id)
        .order('is_primary_contact', { ascending: false })
        .order('first_name');
      
      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchContactsByCompany(companyId);
    } else {
      setContacts([]);
      setLoading(false);
    }
  }, [companyId]);

  return {
    contacts,
    loading,
    error,
    refetch: () => companyId ? fetchContactsByCompany(companyId) : null
  };
};