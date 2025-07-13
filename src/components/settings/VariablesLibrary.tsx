import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Variable {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'text' | 'calculation';
  defaultValue?: string;
  unit?: string;
}

const VariablesLibrary: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([
    {
      id: '1',
      name: 'width',
      description: 'Product width dimension',
      type: 'number',
      defaultValue: '0',
      unit: 'inches'
    },
    {
      id: '2',
      name: 'height',
      description: 'Product height dimension',
      type: 'number',
      defaultValue: '0',
      unit: 'inches'
    },
    {
      id: '3',
      name: 'materialCost',
      description: 'Base material cost per unit',
      type: 'number',
      defaultValue: '0',
      unit: 'dollars'
    },
    {
      id: '4',
      name: 'laborHours',
      description: 'Estimated labor hours',
      type: 'number',
      defaultValue: '1',
      unit: 'hours'
    }
  ]);

  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateVariable = () => {
    setEditingVariable({
      id: '',
      name: '',
      description: '',
      type: 'number',
      defaultValue: '',
      unit: ''
    });
    setIsDialogOpen(true);
  };

  const handleEditVariable = (variable: Variable) => {
    setEditingVariable(variable);
    setIsDialogOpen(true);
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  const handleSaveVariable = () => {
    if (!editingVariable) return;
    
    if (editingVariable.id) {
      setVariables(prev => prev.map(v => v.id === editingVariable.id ? editingVariable : v));
    } else {
      const newVariable = { ...editingVariable, id: Date.now().toString() };
      setVariables(prev => [...prev, newVariable]);
    }
    
    setIsDialogOpen(false);
    setEditingVariable(null);
  };

  const handleCopyVariable = (variable: Variable) => {
    navigator.clipboard.writeText(variable.name);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-green-100 text-green-800';
      case 'calculation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variables Library</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Define reusable variables for your formulas. Click the copy icon to copy variable names for use in formulas.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Available Variables</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateVariable} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Variable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVariable?.id ? 'Edit Variable' : 'Create New Variable'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="variableName">Variable Name</Label>
                  <Input
                    id="variableName"
                    value={editingVariable?.name || ''}
                    onChange={(e) => setEditingVariable(prev => prev ? { ...prev, name: e.target.value } : null)}
                    placeholder="e.g., width, materialCost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variableDescription">Description</Label>
                  <Textarea
                    id="variableDescription"
                    value={editingVariable?.description || ''}
                    onChange={(e) => setEditingVariable(prev => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="Describe what this variable represents"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="variableType">Type</Label>
                  <Select
                    value={editingVariable?.type || 'number'}
                    onValueChange={(value: 'number' | 'text' | 'calculation') => 
                      setEditingVariable(prev => prev ? { ...prev, type: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="calculation">Calculation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultValue">Default Value</Label>
                  <Input
                    id="defaultValue"
                    value={editingVariable?.defaultValue || ''}
                    onChange={(e) => setEditingVariable(prev => prev ? { ...prev, defaultValue: e.target.value } : null)}
                    placeholder="Default value for this variable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit (Optional)</Label>
                  <Input
                    id="unit"
                    value={editingVariable?.unit || ''}
                    onChange={(e) => setEditingVariable(prev => prev ? { ...prev, unit: e.target.value } : null)}
                    placeholder="e.g., inches, dollars, hours"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveVariable}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Variable Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables.map((variable) => (
              <TableRow key={variable.id}>
                <TableCell className="font-mono font-medium">{variable.name}</TableCell>
                <TableCell>{variable.description}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(variable.type)}>
                    {variable.type}
                  </Badge>
                </TableCell>
                <TableCell>{variable.defaultValue}</TableCell>
                <TableCell>{variable.unit}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyVariable(variable)}
                      title="Copy variable name"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVariable(variable)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteVariable(variable.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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

export default VariablesLibrary;