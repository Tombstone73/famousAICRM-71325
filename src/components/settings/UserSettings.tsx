import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Edit2, Search, RefreshCw, AlertCircle, Loader2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUsers } from '@/hooks/useUsers';
import { useAppContext } from '@/contexts/AppContext';
import AddUserDialog from '@/components/auth/AddUserDialog';
import CreateTestUser from '@/components/admin/CreateTestUser';

const UserSettings: React.FC = () => {
  const { users, loading, error, updateUserPermission, refetch } = useUsers();
  const { user: currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [updatingPermissions, setUpdatingPermissions] = useState<string>('');

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionToggle = async (userId: string, permission: string, enabled: boolean) => {
    setUpdatingPermissions(`${userId}-${permission}`);
    try {
      await updateUserPermission(userId, permission, enabled);
    } catch (error) {
      console.error('Failed to update permission:', error);
    } finally {
      setUpdatingPermissions('');
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setAddUserOpen(true);
  };

  const handleCloseDialog = () => {
    setAddUserOpen(false);
    setEditingUser(null);
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage users, roles, and permissions</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied: You need administrator privileges to view and manage users.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Manage users, roles, and permissions</p>
      </div>

      <CreateTestUser />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-medium">Failed to fetch users</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users & Roles</CardTitle>
              <CardDescription>Manage user accounts and role assignments</CardDescription>
            </div>
            <Button onClick={() => setAddUserOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{user.name || 'No Name'}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant="secondary">
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(user.permissions || {}).map(([permission, enabled]) => (
                        <div key={permission} className="flex items-center justify-between">
                          <Label className="text-sm capitalize">{permission}</Label>
                          <Switch
                            checked={enabled as boolean}
                            onCheckedChange={(checked) => handlePermissionToggle(user.id, permission, checked)}
                            disabled={updatingPermissions === `${user.id}-${permission}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AddUserDialog 
        open={addUserOpen} 
        onOpenChange={setAddUserOpen}
        editingUser={editingUser}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default UserSettings;
