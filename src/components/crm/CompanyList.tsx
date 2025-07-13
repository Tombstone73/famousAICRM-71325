import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Settings, Eye, Edit, Mail, Phone } from 'lucide-react';
import { Company } from '@/types';
import ColumnManager, { Column } from './ColumnManager';

const CompanyList: React.FC = () => {
  const [companies] = useState<Company[]>([
    { 
      id: '1', 
      name: 'Acme Corporation', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'john.smith@acme.com',
      main_phone: '(555) 123-4567',
      street_address: '123 Business St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      payment_terms: 'Net 30',
      primary_contact: 'John Smith'
    },
    { 
      id: '2', 
      name: 'Acme Corporation', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'john.smith@acmecorp.com',
      main_phone: '(555) 123-4567',
      street_address: '456 Innovation Ave',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94105',
      payment_terms: 'No Terms',
      primary_contact: 'John Smith'
    },
    { 
      id: '3', 
      name: 'Brainstorm Print', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'jess@brainstormprint.com',
      main_phone: '',
      street_address: '789 Main St',
      city: 'Austin',
      state: 'TX',
      zip_code: '73301',
      payment_terms: 'Net 30',
      primary_contact: 'Jessica Seltzer'
    },
    { 
      id: '4', 
      name: 'Creative Agency Co', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'alex@creativeagency.com',
      main_phone: '(555) 567-8901',
      street_address: '321 Creative Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      payment_terms: 'No Terms',
      primary_contact: 'Alex Thompson'
    },
    { 
      id: '5', 
      name: 'Creative Agency LLC', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'david@creativeagency.com',
      main_phone: '(555) 456-7890',
      street_address: '555 Learning Lane',
      city: 'Boston',
      state: 'MA',
      zip_code: '02101',
      payment_terms: 'No Terms',
      primary_contact: 'David Wilson'
    },
    { 
      id: '6', 
      name: 'Educational Institute', 
      type: 'B2B', 
      status: 'Active', 
      main_email: 'james.brown@education.edu',
      main_phone: '(555) 890-1234',
      street_address: '999 Education Blvd',
      city: 'Chicago',
      state: 'IL',
      zip_code: '60601',
      payment_terms: 'No Terms',
      primary_contact: 'Professor James Brown'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'company', label: 'Company', visible: true },
    { id: 'contact', label: 'Contact', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'phone', label: 'Phone', visible: true },
    { id: 'address', label: 'Address', visible: false },
    { id: 'type', label: 'Type', visible: true },
    { id: 'terms', label: 'Terms', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'actions', label: 'Actions', visible: true }
  ]);

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleColumns = columns.filter(col => col.visible);

  const getTermsBadge = (terms: string) => {
    if (terms === 'Net 30') {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">{terms}</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">{terms}</Badge>;
  };

  const renderCell = (company: Company, columnId: string) => {
    switch (columnId) {
      case 'company':
        return (
          <button className="text-blue-600 hover:text-blue-800 font-medium text-left">
            {company.name}
          </button>
        );
      case 'contact':
        return <span className="text-gray-900">{company.primary_contact || 'N/A'}</span>;
      case 'email':
        return (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{company.main_email}</span>
          </div>
        );
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            {company.main_phone && <Phone className="w-4 h-4 text-gray-400" />}
            <span className="text-gray-900">{company.main_phone || ''}</span>
          </div>
        );
      case 'address':
        return (
          <span className="text-gray-900">
            {`${company.street_address}, ${company.city}, ${company.state} ${company.zip_code}`}
          </span>
        );
      case 'type':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
            {company.type}
          </Badge>
        );
      case 'terms':
        return getTermsBadge(company.payment_terms || 'No Terms');
      case 'status':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            {company.status}
          </Badge>
        );
      case 'actions':
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Customers</h1>
        <p className="text-sm text-gray-500 mb-4">Click column headers to sort • Click company names to view details</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {filteredCompanies.length} customers found
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowColumnManager(true)}
          >
            <Settings className="w-4 h-4" />
            Manage Columns
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-sm"
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className="font-medium text-gray-700">
                  {column.label}{column.id === 'company' ? ' ↑' : ''}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id} className="hover:bg-gray-50">
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {renderCell(company, column.id)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ColumnManager
        open={showColumnManager}
        onOpenChange={setShowColumnManager}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
};

export default CompanyList;