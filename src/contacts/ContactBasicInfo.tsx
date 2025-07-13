import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Contact, Company } from '@/types';

interface ContactBasicInfoProps {
  contact: Contact;
  companies: Company[];
  isEditing: boolean;
  onContactChange: (updates: Partial<Contact>) => void;
}

export function ContactBasicInfo({ contact, companies, isEditing, onContactChange }: ContactBasicInfoProps) {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-600">First Name</Label>
            <p className="text-sm">{contact.first_name || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Last Name</Label>
            <p className="text-sm">{contact.last_name || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Job Title</Label>
            <p className="text-sm">{contact.title || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600">Department</Label>
            <p className="text-sm">{contact.department || 'Not specified'}</p>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-600">Company</Label>
          <p className="text-sm">{companies.find(c => c.id === contact.company_id)?.name || 'Not specified'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={contact.first_name || ''}
            onChange={(e) => onContactChange({ first_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={contact.last_name || ''}
            onChange={(e) => onContactChange({ last_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={contact.title || ''}
            onChange={(e) => onContactChange({ title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={contact.department || ''}
            onChange={(e) => onContactChange({ department: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Select value={contact.company_id} onValueChange={(value) => onContactChange({ company_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}