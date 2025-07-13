import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PrinterMapping {
  id: string;
  printerName: string;
  quickSetName: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
}

const PrinterMappings: React.FC = () => {
  const [mappings, setMappings] = useState<PrinterMapping[]>([
    {
      id: '1',
      printerName: 'HP LaserJet Pro',
      quickSetName: 'Standard Business Cards',
      status: 'active',
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      printerName: 'Canon ImagePress',
      quickSetName: 'Premium Brochures',
      status: 'active',
      lastUsed: '2024-01-14'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMapping, setEditingMapping] = useState<PrinterMapping | null>(null);
  const [formData, setFormData] = useState({
    printerName: '',
    quickSetName: '',
    status: 'active' as 'active' | 'inactive'
  });

  const handleSave = () => {
    if (editingMapping) {
      setMappings(prev => prev.map(m => 
        m.id === editingMapping.id 
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMapping: PrinterMapping = {
        id: Date.now().toString(),
        ...formData
      };
      setMappings(prev => [...prev, newMapping]);
    }
    setIsDialogOpen(false);
    setEditingMapping(null);
    setFormData({ printerName: '', quickSetName: '', status: 'active' });
  };

  const handleEdit = (mapping: PrinterMapping) => {
    setEditingMapping(mapping);
    setFormData({
      printerName: mapping.printerName,
      quickSetName: mapping.quickSetName,
      status: mapping.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Printer-to-QuickSet Mappings</CardTitle>
            <CardDescription>
              Configure which QuickSets are automatically applied to specific printers
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingMapping(null);
                setFormData({ printerName: '', quickSetName: '', status: 'active' });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMapping ? 'Edit Mapping' : 'Add New Mapping'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="printerName">Printer Name</Label>
                  <Input
                    id="printerName"
                    value={formData.printerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, printerName: e.target.value }))}
                    placeholder="Enter printer name"
                  />
                </div>
                <div>
                  <Label htmlFor="quickSetName">QuickSet Name</Label>
                  <Input
                    id="quickSetName"
                    value={formData.quickSetName}
                    onChange={(e) => setFormData(prev => ({ ...prev, quickSetName: e.target.value }))}
                    placeholder="Enter QuickSet name"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingMapping ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Printer Name</TableHead>
              <TableHead>QuickSet Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((mapping) => (
              <TableRow key={mapping.id}>
                <TableCell className="font-medium">{mapping.printerName}</TableCell>
                <TableCell>{mapping.quickSetName}</TableCell>
                <TableCell>
                  <Badge variant={mapping.status === 'active' ? 'default' : 'secondary'}>
                    {mapping.status}
                  </Badge>
                </TableCell>
                <TableCell>{mapping.lastUsed || 'Never'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(mapping)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PrinterMappings;