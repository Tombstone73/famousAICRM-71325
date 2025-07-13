import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

const RoleManagement: React.FC = () => {
  const { users, loading, error, fetchUsers } = useUsers();
  const { user: currentUser } = useAppContext();
  const [updatingUser, setUpdatingUser] = useState<string>('');
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null);

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUser(userId);
    setUpdateResult(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        setUpdateResult({ success: false, message: error.message });
      } else {
        setUpdateResult({ success: true, message: 'User role updated successfully' });
        fetchUsers();
      }
    } catch (err) {
      setUpdateResult({ success: false, message: 'Failed to update user role' });
    } finally {
      setUpdatingUser('');
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Access denied: You need administrator privileges to manage user roles.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load users: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {updateResult && (
          <Alert variant={updateResult.success ? "default" : "destructive"}>
            <AlertDescription>{updateResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium">{user.full_name || 'No Name'}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Badge 
                  variant={user.role === 'admin' ? 'destructive' : user.role === 'employee' ? 'default' : 'secondary'}
                >
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select
                  value={user.role}
                  onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                  disabled={updatingUser === user.id || user.id === currentUser?.id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                
                {updatingUser === user.id && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleManagement;