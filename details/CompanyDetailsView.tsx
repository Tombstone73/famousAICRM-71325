import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useContactsByCompany } from '@/hooks/useContactsByCompany';
import { CompanyFinancialSection } from './CompanyFinancialSection';
import { CompanyNotesSection } from './CompanyNotesSection';

const CompanyDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { companies, updateCompany } = useCompanies();
  const { contacts } = useContactsByCompany(id || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  
  const company = companies.find(c => c.id === id);
  
  if (!company) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({ ...company });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateCompany(id!, editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{company.name}</h1>
          <Badge variant={company.status === 'Active' ? 'default' : 'secondary'}>
            {company.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={editData.name || ''} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  value={editData.main_phone || ''} 
                  onChange={(e) => handleInputChange('main_phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={editData.main_email || ''} 
                  onChange={(e) => handleInputChange('main_email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website"
                  value={editData.website || ''} 
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input 
                  id="industry"
                  value={editData.industry || ''} 
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Input 
                  id="type"
                  value={editData.type || ''} 
                  onChange={(e) => handleInputChange('type', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address"
                  value={editData.street_address || ''} 
                  onChange={(e) => handleInputChange('street_address', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city"
                  value={editData.city || ''} 
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state"
                  value={editData.state || ''} 
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip"
                  value={editData.zip_code || ''} 
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Name:</span>
                <span>{company.name || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Phone:</span>
                <span>{company.main_phone || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Email:</span>
                <span>{company.main_email || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Address:</span>
                <span>{company.street_address || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Website:</span>
                <span>{company.website || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Industry:</span>
                <span>{company.industry || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">Type:</span>
                <span>{company.type || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">City:</span>
                <span>{company.city || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">State:</span>
                <span>{company.state || 'Not specified'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="font-semibold min-w-[100px]">ZIP Code:</span>
                <span>{company.zip_code || 'Not specified'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CompanyFinancialSection 
        company={company}
        isEditing={isEditing}
        editData={editData}
        handleInputChange={handleInputChange}
      />

      <CompanyNotesSection 
        company={company}
        isEditing={isEditing}
        editData={editData}
        handleInputChange={handleInputChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Contacts ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-muted-foreground">No contacts found</p>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <Link to={`/contacts/${contact.id}`} className="font-medium text-blue-600 hover:underline block">
                    {contact.first_name} {contact.last_name}
                  </Link>
                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                    {contact.title && <div>{contact.title}</div>}
                    {contact.email && <div>{contact.email}</div>}
                    {contact.phone && <div>{contact.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetailsView;