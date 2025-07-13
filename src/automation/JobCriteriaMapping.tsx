import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CriteriaRule {
  id: string;
  name: string;
  criteria: {
    field: string;
    operator: string;
    value: string;
  }[];
  action: string;
  priority: number;
  enabled: boolean;
  description?: string;
}

const JobCriteriaMapping: React.FC = () => {
  const [rules, setRules] = useState<CriteriaRule[]>([
    {
      id: '1',
      name: 'Rush Orders',
      criteria: [
        { field: 'priority', operator: 'equals', value: 'rush' },
        { field: 'dueDate', operator: 'lessThan', value: '24hours' }
      ],
      action: 'assign_to_express_queue',
      priority: 1,
      enabled: true,
      description: 'Route rush orders to express production queue'
    },
    {
      id: '2',
      name: 'Large Format Jobs',
      criteria: [
        { field: 'width', operator: 'greaterThan', value: '12' },
        { field: 'height', operator: 'greaterThan', value: '18' }
      ],
      action: 'assign_to_large_format_printer',
      priority: 2,
      enabled: true,
      description: 'Route large format jobs to wide format printers'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CriteriaRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    action: '',
    priority: 1,
    enabled: true,
    description: '',
    criteria: [{ field: '', operator: '', value: '' }]
  });

  const fieldOptions = [
    'priority', 'dueDate', 'width', 'height', 'quantity', 'customerType', 'productType', 'material'
  ];

  const operatorOptions = [
    'equals', 'notEquals', 'greaterThan', 'lessThan', 'contains', 'startsWith', 'endsWith'
  ];

  const actionOptions = [
    'assign_to_express_queue',
    'assign_to_large_format_printer',
    'assign_to_digital_press',
    'assign_to_offset_press',
    'require_approval',
    'send_notification',
    'apply_discount'
  ];

  const handleSave = () => {
    if (editingRule) {
      setRules(prev => prev.map(r => 
        r.id === editingRule.id 
          ? { ...r, ...formData }
          : r
      ));
    } else {
      const newRule: CriteriaRule = {
        id: Date.now().toString(),
        ...formData
      };
      setRules(prev => [...prev, newRule]);
    }
    setIsDialogOpen(false);
    setEditingRule(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      action: '',
      priority: 1,
      enabled: true,
      description: '',
      criteria: [{ field: '', operator: '', value: '' }]
    });
  };

  const handleEdit = (rule: CriteriaRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      action: rule.action,
      priority: rule.priority,
      enabled: rule.enabled,
      description: rule.description || '',
      criteria: rule.criteria
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const addCriteria = () => {
    setFormData(prev => ({
      ...prev,
      criteria: [...prev.criteria, { field: '', operator: '', value: '' }]
    }));
  };

  const removeCriteria = (index: number) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  const updateCriteria = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Job Criteria Mapping Rules</CardTitle>
            <CardDescription>
              Define rules to automatically route jobs based on specific criteria
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingRule(null);
                resetForm();
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? 'Edit Rule' : 'Add New Rule'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter rule name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this rule does"
                  />
                </div>

                <div>
                  <Label>Criteria</Label>
                  {formData.criteria.map((criterion, index) => (
                    <div key={index} className="flex space-x-2 mt-2">
                      <Select value={criterion.field} onValueChange={(value) => updateCriteria(index, 'field', value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Field" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldOptions.map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={criterion.operator} onValueChange={(value) => updateCriteria(index, 'operator', value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {operatorOptions.map(op => (
                            <SelectItem key={op} value={op}>{op}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        className="flex-1"
                        value={criterion.value}
                        onChange={(e) => updateCriteria(index, 'value', e.target.value)}
                        placeholder="Value"
                      />
                      {formData.criteria.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCriteria(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCriteria}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Criteria
                  </Button>
                </div>

                <div>
                  <Label htmlFor="action">Action</Label>
                  <Select value={formData.action} onValueChange={(value) => setFormData(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map(action => (
                        <SelectItem key={action} value={action}>
                          {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {editingRule ? 'Update' : 'Create'}
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
              <TableHead>Rule Name</TableHead>
              <TableHead>Criteria</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {rule.criteria.map((c, i) => (
                      <div key={i} className="text-sm text-gray-600">
                        {c.field} {c.operator} {c.value}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {rule.action.replace(/_/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>{rule.priority}</TableCell>
                <TableCell>
                  <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(rule.id)}
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

export default JobCriteriaMapping;