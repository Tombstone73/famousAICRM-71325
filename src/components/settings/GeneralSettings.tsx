import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Building2, Clock, DollarSign, FileText } from 'lucide-react';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

const GeneralSettings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Print Shop Pro',
    address: '123 Main St, City, State 12345',
    phone: '(555) 123-4567',
    email: 'info@printshoppro.com',
    website: 'www.printshoppro.com'
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '08:00', close: '17:00', closed: false },
    tuesday: { open: '08:00', close: '17:00', closed: false },
    wednesday: { open: '08:00', close: '17:00', closed: false },
    thursday: { open: '08:00', close: '17:00', closed: false },
    friday: { open: '08:00', close: '17:00', closed: false },
    saturday: { open: '09:00', close: '15:00', closed: false },
    sunday: { open: '10:00', close: '14:00', closed: true }
  });

  const [defaultUnits, setDefaultUnits] = useState('inches');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('8.25');
  const [filenameFormat, setFilenameFormat] = useState('{orderNumber}_{customerName}_{date}');

  const handleSave = () => {
    console.log('Saving general settings...');
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Basic company details used throughout the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyInfo.website}
                onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your operating hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24 capitalize font-medium">{day}</div>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={hours.open}
                  onChange={(e) => setBusinessHours({
                    ...businessHours,
                    [day]: { ...hours, open: e.target.value }
                  })}
                  disabled={hours.closed}
                  className="w-32"
                />
                <span>to</span>
                <Input
                  type="time"
                  value={hours.close}
                  onChange={(e) => setBusinessHours({
                    ...businessHours,
                    [day]: { ...hours, close: e.target.value }
                  })}
                  disabled={hours.closed}
                  className="w-32"
                />
                <Button
                  variant={hours.closed ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => setBusinessHours({
                    ...businessHours,
                    [day]: { ...hours, closed: !hours.closed }
                  })}
                >
                  {hours.closed ? 'Closed' : 'Open'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Default Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Default Settings
          </CardTitle>
          <CardDescription>
            System-wide defaults for units, currency, and tax
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="units">Default Units</Label>
              <Select value={defaultUnits} onValueChange={setDefaultUnits}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="millimeters">Millimeters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="8.25"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filename Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Default Filename Format
          </CardTitle>
          <CardDescription>
            Template for generating filenames for orders and proofs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="filenameFormat">Filename Template</Label>
            <Input
              id="filenameFormat"
              value={filenameFormat}
              onChange={(e) => setFilenameFormat(e.target.value)}
              placeholder="{orderNumber}_{customerName}_{date}"
            />
            <p className="text-sm text-gray-500 mt-2">
              Available variables: {'{orderNumber}'}, {'{customerName}'}, {'{date}'}, {'{time}'}, {'{productName}'}
            </p>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm font-medium">Preview:</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ORD-2024-001_ABC_Company_2024-01-15.pdf
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save General Settings
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;