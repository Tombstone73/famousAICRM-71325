import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_permissions(
            permission_name,
            enabled
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        throw error;
      }
      
      const transformedUsers = (data || []).map(user => {
        const permissions = {
          orders: false,
          production: false,
          contacts: false,
          products: false,
          reports: false,
          settings: false
        };
        
        if (user.user_permissions) {
          user.user_permissions.forEach((perm: any) => {
            if (perm.enabled) {
              permissions[perm.permission_name as keyof typeof permissions] = true;
            }
          });
        }
        
        return {
          ...user,
          permissions
        };
      });
      
      setUsers(transformedUsers);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      setError(error.message || 'Failed to fetch users');
      toast.error(`Failed to fetch users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: any) => {
    try {
      console.log('Creating user with data:', userData);
      
      // Use the fixed edge function for secure user creation
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: userData.email,
          password: userData.password || 'TempPass123!',
          name: userData.name,
          role: userData.role || 'customer',
          company_id: userData.company_id
        }
      });
      
      console.log('Edge function response:', { data, error });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to create user');
      }
      
      if (data?.error) {
        console.error('Data error:', data.error);
        throw new Error(data.error);
      }
      
      if (!data?.user) {
        throw new Error('No user data returned from server');
      }
      
      // Refresh the users list
      await fetchUsers();
      
      return data.user;
    } catch (error: any) {
      console.error('Failed to create user:', error);
      const errorMessage = error.message || 'Failed to create user';
      toast.error(`Error adding user: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
      return data;
    } catch (error: any) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const updateUserPermission = async (userId: string, permission: string, enabled: boolean) => {
    try {
      const { data: existingPerm } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('permission_name', permission)
        .single();
      
      if (existingPerm) {
        const { error } = await supabase
          .from('user_permissions')
          .update({ enabled })
          .eq('user_id', userId)
          .eq('permission_name', permission);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_permissions')
          .insert({
            user_id: userId,
            permission_name: permission,
            enabled
          });
        
        if (error) throw error;
      }
      
      setUsers(prev => prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permission]: enabled
            }
          };
        }
        return user;
      }));
      
      toast.success('Permission updated successfully');
    } catch (error: any) {
      console.error('Failed to update permission:', error);
      toast.error(`Failed to update permission: ${error.message}`);
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    updateUserPermission,
    deleteUser,
    refetch: fetchUsers
  };
};
