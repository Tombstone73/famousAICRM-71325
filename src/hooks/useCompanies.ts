import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Company } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('display_priority', { ascending: false })
        .order('name');

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (companyData: Partial<Company>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Validate user authentication
      if (!user?.id) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to create a company.',
          variant: 'destructive'
        });
        throw new Error('User not authenticated');
      }
      
      console.log('Creating company with data:', companyData);
      
      // Validate required fields
      if (!companyData.name?.trim()) {
        throw new Error('Company name is required');
      }

      // Get the first billing email from the array
      const billingEmail = companyData.billing_emails?.[0]?.trim() || '';
      
      if (!billingEmail) {
        throw new Error('At least one billing email is required');
      }

      // Prepare data for insertion using the correct field name
      const insertData = {
        name: companyData.name.trim(),
        billing_email: billingEmail,
        type: companyData.type || 'B2B',
        status: companyData.status || 'Active',
        industry: companyData.industry || null,
        main_phone: companyData.main_phone || null,
        main_email: companyData.main_email || null,
        website: companyData.website || null,
        billing_emails: companyData.billing_emails?.filter(email => email.trim()) || null,
        shipping_emails: companyData.shipping_emails?.filter(email => email.trim()) || null,
        order_notes_email: companyData.order_notes_email || null,
        street_address: companyData.street_address || null,
        city: companyData.city || null,
        state: companyData.state || null,
        zip_code: companyData.zip_code || null,
        country: companyData.country || 'USA',
        payment_terms: companyData.payment_terms || null,
        tax_exempt: companyData.tax_exempt || false,
        tax_id: companyData.tax_id || null,
        default_discount_percent: companyData.default_discount_percent || 0,
        custom_pricing_rules: companyData.custom_pricing_rules || false,
        internal_notes: companyData.internal_notes || null,
        display_priority: companyData.display_priority || 0,
        tags: companyData.tags || null,
        created_by: user.id, // Use actual user UUID
        date_added: new Date().toISOString()
      };

      console.log('Inserting company data:', insertData);

      const { data, error } = await supabase
        .from('companies')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to create company: ${error.message}`);
      }
      
      console.log('Company created successfully:', data);
      setCompanies(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Create company error:', err);
      toast({
        title: 'Error',
        description: `Failed to create company: ${err?.message}`,
        variant: 'destructive'
      });
      throw err instanceof Error ? err : new Error('Failed to create company');
    }
  };

  const updateCompany = async (id: string, companyData: Partial<Company>) => {
    try {
      const billingEmail = companyData.billing_emails?.[0]?.trim() || companyData.main_email?.trim() || '';
      
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...companyData,
          billing_email: billingEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCompanies(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err: any) {
      console.error('Update company error:', err);
      toast({
        title: 'Error',
        description: `Failed to update company: ${err?.message}`,
        variant: 'destructive'
      });
      throw err instanceof Error ? err : new Error('Failed to update company');
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Delete company error:', err);
      toast({
        title: 'Error',
        description: `Failed to delete company: ${err?.message}`,
        variant: 'destructive'
      });
      throw err instanceof Error ? err : new Error('Failed to delete company');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies
  };
};