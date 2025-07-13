import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface GeneralInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const GeneralInfo: React.FC<GeneralInfoProps> = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="name">Company Name *</Label>
      <Input
        id="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Company Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="B2B">B2B</SelectItem>
            <SelectItem value="B2C">B2C</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        />
      </div>
    </div>
    <div>
      <Label>Status</Label>
      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Prospect">Prospect</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);