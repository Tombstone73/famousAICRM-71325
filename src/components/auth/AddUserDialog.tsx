import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';
import { useCompanies } from '@/hooks/useCompanies';
import { toast } from 'sonner';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: any;
  onClose: () => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  editingUser,
  onClose
}) => {
  const { createUser, updateUser } = useUsers();
  const { companies } = useCompanies();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'customer',
    company_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        role: editingUser.role || 'customer',
        company_id: editingUser.company_id || '',
        password: ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'customer',
        company_id: '',
        password: ''
      });
    }
  }, [editingUser, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await createUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          company_id: formData.company_id || null,
          password: formData.password || 'TempPass123!'
        });
        toast.success('User created successfully!');
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {!editingUser && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank for default password"
              />
            </div>
          )}

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="company">Company</Label>
            <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select company (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-company">No Company</SelectItem>
                {companies?.filter(company => company && company.id && company.name).map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;