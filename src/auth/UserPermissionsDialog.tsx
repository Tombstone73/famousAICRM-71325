import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  open,
  onOpenChange,
  user
}) => {
  const { updateUserPermission } = useUsers();
  const [saving, setSaving] = useState(false);

  const permissions = [
    { key: 'orders', label: 'Orders', description: 'View and manage orders' },
    { key: 'production', label: 'Production', description: 'Access production queue' },
    { key: 'contacts', label: 'Contacts', description: 'Manage contacts and companies' },
    { key: 'products', label: 'Products', description: 'Manage product catalog' },
    { key: 'reports', label: 'Reports', description: 'View reports and analytics' },
    { key: 'settings', label: 'Settings', description: 'Access system settings' }
  ];

  const handlePermissionChange = async (permission: string, enabled: boolean) => {
    try {
      setSaving(true);
      await updateUserPermission(user.id, permission, enabled);
    } catch (error) {
      console.error('Failed to update permission:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User Permissions</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Badge className={user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
              {user.role}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {permissions.map((permission) => (
                <div key={permission.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="font-medium">{permission.label}</Label>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                  <Switch
                    checked={user.permissions?.[permission.key] || false}
                    onCheckedChange={(enabled) => handlePermissionChange(permission.key, enabled)}
                    disabled={saving}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;