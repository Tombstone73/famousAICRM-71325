import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

const CreateTestUser: React.FC = () => {
  const { createUser } = useUsers();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'admin'
  });

  const handleCreateTestUser = async () => {
    setLoading(true);
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company_id: null
      });
      toast.success('Test user created successfully!');
    } catch (error: any) {
      console.error('Failed to create test user:', error);
      toast.error(`Failed to create test user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Test User</CardTitle>
        <CardDescription>
          Create a test user for development purposes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="test-name">Name</Label>
          <Input
            id="test-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="test-email">Email</Label>
          <Input
            id="test-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="test-password">Password</Label>
          <Input
            id="test-password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="test-role">Role</Label>
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
        
        <Button 
          onClick={handleCreateTestUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Test User'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateTestUser;
