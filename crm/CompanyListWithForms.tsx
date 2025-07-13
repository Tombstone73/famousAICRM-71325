import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Settings, Eye, Edit, Mail, Phone } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import CompanyForm from './CompanyForm';
import ColumnManager, { Column } from './ColumnManager';
import { useToast } from '@/hooks/use-toast';
import { Company } from '@/types';

const CompanyListWithForms: React.FC = () => {
  const { companies, loading, addCompany, updateCompany, deleteCompany } = useCompanies();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();
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
    (company.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleColumns = columns.filter(col => col.visible);

  const handleSave = async (companyData: Partial<Company>) => {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, companyData);
        toast({ title: 'Company updated successfully' });
      } else {
        await addCompany(companyData as Omit<Company, 'id'>);
        toast({ title: 'Company created successfully' });
      }
      setShowForm(false);
      setEditingCompany(undefined);
    } catch (error) {
      toast({ title: 'Error saving company', variant: 'destructive' });
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

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
          <Link to={`/companies/${company.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
            {company.name}
          </Link>
        );
      case 'contact':
        return <span className="text-gray-900">{company.primary_contact || 'N/A'}</span>;
      case 'email':
        return (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{company.main_email || company.billing_email}</span>
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
            {company.street_address ? `${company.street_address}, ${company.city}, ${company.state} ${company.zip_code}` : 'N/A'}
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
            <Link to={`/companies/${company.id}`}>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => handleEdit(company)}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (showForm) {
    return (
      <CompanyForm
        company={editingCompany}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingCompany(undefined);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Customers</h1>
            <p className="text-sm text-gray-500">Click column headers to sort • Click company names to view details</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setShowColumnManager(true)}
            >
              <Settings className="w-4 h-4" />
              Manage Columns
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            {filteredCompanies.length} customers found
          </div>
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

      {loading ? (
        <div className="text-center py-8">Loading companies...</div>
      ) : (
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
      )}

      <ColumnManager
        open={showColumnManager}
        onOpenChange={setShowColumnManager}
        columns={columns}
        onColumnsChange={setColumns}
      />
    </div>
  );
};

export default CompanyListWithForms;