import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calculator, Copy } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Formula {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: string[];
  category: string;
  usageCount: number;
}

interface FormulaLibraryManagerProps {
  onPricingUpdate: (updateData: any) => void;
}

export const FormulaLibraryManager: React.FC<FormulaLibraryManagerProps> = ({ onPricingUpdate }) => {
  const [formulas, setFormulas] = useState<Formula[]>([
    {
      id: '1',
      name: 'Grommet Calculation',
      description: 'Calculate grommets based on perimeter and spacing',
      formula: 'ceil((width * 2 + height * 2) / spacing) * rate',
      variables: ['width', 'height', 'spacing', 'rate'],
      category: 'finishing',
      usageCount: 15
    },
    {
      id: '2',
      name: 'Pole Pocket Linear',
      description: 'Linear footage pricing for pole pockets',
      formula: 'width * rate + setup_fee',
      variables: ['width', 'rate', 'setup_fee'],
      category: 'finishing',
      usageCount: 8
    }
  ]);
  
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    formula: '',
    category: ''
  });

  const handleEdit = (formula: Formula) => {
    setEditingFormula(formula);
    setFormData({
      name: formula.name,
      description: formula.description,
      formula: formula.formula,
      category: formula.category
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingFormula(null);
    setFormData({ name: '', description: '', formula: '', category: '' });
    setShowDialog(true);
  };

  const handleSave = () => {
    const variables = extractVariables(formData.formula);
    
    if (editingFormula) {
      const updatedFormulas = formulas.map(f => 
        f.id === editingFormula.id 
          ? { ...f, ...formData, variables }
          : f
      );
      setFormulas(updatedFormulas);
      
      // Trigger pricing update check
      onPricingUpdate({
        type: 'formula_update',
        formulaId: editingFormula.id,
        oldFormula: editingFormula.formula,
        newFormula: formData.formula
      });
    } else {
      const newFormula: Formula = {
        id: Date.now().toString(),
        ...formData,
        variables,
        usageCount: 0
      };
      setFormulas([...formulas, newFormula]);
    }
    
    setShowDialog(false);
  };

  const handleDelete = (id: string) => {
    const formula = formulas.find(f => f.id === id);
    if (formula && formula.usageCount > 0) {
      if (!confirm(`This formula is used by ${formula.usageCount} products. Are you sure you want to delete it?`)) {
        return;
      }
    }
    setFormulas(formulas.filter(f => f.id !== id));
  };

  const extractVariables = (formula: string): string[] => {
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const matches = formula.match(variablePattern) || [];
    const mathFunctions = ['ceil', 'floor', 'round', 'abs', 'min', 'max', 'sqrt', 'pow'];
    return [...new Set(matches.filter(match => !mathFunctions.includes(match)))];
  };

  const copyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Formula Library</h3>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Formula
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Formula</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formulas.map((formula) => (
                <TableRow key={formula.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{formula.name}</div>
                      <div className="text-sm text-gray-500">{formula.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {formula.formula}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {formula.variables.map(variable => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={formula.usageCount > 0 ? 'default' : 'secondary'}>
                      {formula.usageCount} products
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => copyFormula(formula.formula)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(formula)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(formula.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFormula ? 'Edit Formula' : 'Add New Formula'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Grommet Calculation"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., finishing, sizing"
                />
              </div>
            </div>
            
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Brief description of what this formula calculates"
              />
            </div>
            
            <div>
              <Label>Formula</Label>
              <Textarea
                value={formData.formula}
                onChange={(e) => setFormData({...formData, formula: e.target.value})}
                placeholder="e.g., ceil(width / spacing) * rate"
                className="font-mono"
              />
            </div>
            
            {formData.formula && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <strong>Variables detected:</strong> {extractVariables(formData.formula).join(', ')}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingFormula ? 'Update' : 'Add'} Formula
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};