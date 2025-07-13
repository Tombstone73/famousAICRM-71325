import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrinterRule {
  id: string;
  name: string;
  conditions: {
    printMode?: string;
    mediaGroup?: string;
    widthMin?: number;
    widthMax?: number;
    heightMin?: number;
    heightMax?: number;
    quantity?: number;
  };
  assignedPrinter: string;
  priority: number;
}

interface PrinterAutoAssignmentProps {
  onRuleChange?: (rules: PrinterRule[]) => void;
}

const PrinterAutoAssignment: React.FC<PrinterAutoAssignmentProps> = ({ onRuleChange }) => {
  const { toast } = useToast();
  const [rules, setRules] = useState<PrinterRule[]>([
    {
      id: '1',
      name: 'Small Vinyl Roll',
      conditions: {
        printMode: 'Roll',
        mediaGroup: 'Vinyl',
        widthMax: 54
      },
      assignedPrinter: 'Canon',
      priority: 1
    },
    {
      id: '2',
      name: 'Large Vinyl Roll',
      conditions: {
        printMode: 'Roll',
        mediaGroup: 'Vinyl',
        widthMin: 55
      },
      assignedPrinter: 'S60',
      priority: 2
    },
    {
      id: '3',
      name: 'Flatbed Jobs',
      conditions: {
        printMode: 'Flatbed'
      },
      assignedPrinter: 'Jetson',
      priority: 3
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<PrinterRule>>({
    name: '',
    conditions: {},
    assignedPrinter: '',
    priority: rules.length + 1
  });

  useEffect(() => {
    onRuleChange?.(rules);
  }, [rules, onRuleChange]);

  const addRule = () => {
    if (!newRule.name || !newRule.assignedPrinter) {
      toast({ title: 'Error', description: 'Please fill in rule name and printer', variant: 'destructive' });
      return;
    }

    const rule: PrinterRule = {
      id: Date.now().toString(),
      name: newRule.name!,
      conditions: newRule.conditions || {},
      assignedPrinter: newRule.assignedPrinter!,
      priority: newRule.priority || rules.length + 1
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      conditions: {},
      assignedPrinter: '',
      priority: rules.length + 2
    });
    toast({ title: 'Success', description: 'Rule added successfully' });
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast({ title: 'Success', description: 'Rule removed' });
  };

  const updateNewRuleCondition = (field: string, value: any) => {
    setNewRule(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };

  const formatConditions = (conditions: PrinterRule['conditions']) => {
    const parts = [];
    if (conditions.printMode) parts.push(`Mode: ${conditions.printMode}`);
    if (conditions.mediaGroup) parts.push(`Media: ${conditions.mediaGroup}`);
    if (conditions.widthMin) parts.push(`Width ≥ ${conditions.widthMin}"`);
    if (conditions.widthMax) parts.push(`Width ≤ ${conditions.widthMax}"`);
    if (conditions.heightMin) parts.push(`Height ≥ ${conditions.heightMin}"`);
    if (conditions.heightMax) parts.push(`Height ≤ ${conditions.heightMax}"`);
    if (conditions.quantity) parts.push(`Qty ≥ ${conditions.quantity}`);
    return parts.join(', ') || 'No conditions';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Printer Auto-Assignment Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <Badge variant="secondary">Priority {rule.priority}</Badge>
                  <Badge variant="outline">{rule.assignedPrinter}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatConditions(rule.conditions)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRule(rule.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Rule Name</Label>
              <Input
                value={newRule.name || ''}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Large Format Jobs"
              />
            </div>
            <div>
              <Label>Assign to Printer</Label>
              <Select
                value={newRule.assignedPrinter || ''}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, assignedPrinter: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select printer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Canon">Canon</SelectItem>
                  <SelectItem value="S60">S60</SelectItem>
                  <SelectItem value="S40">S40</SelectItem>
                  <SelectItem value="Jetson">Jetson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Print Mode</Label>
              <Select
                value={newRule.conditions?.printMode || ''}
                onValueChange={(value) => updateNewRuleCondition('printMode', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Roll">Roll</SelectItem>
                  <SelectItem value="Flatbed">Flatbed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Media Group</Label>
              <Select
                value={newRule.conditions?.mediaGroup || ''}
                onValueChange={(value) => updateNewRuleCondition('mediaGroup', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vinyl">Vinyl</SelectItem>
                  <SelectItem value="Paper">Paper</SelectItem>
                  <SelectItem value="Fabric">Fabric</SelectItem>
                  <SelectItem value="Canvas">Canvas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Min Width</Label>
              <Input
                type="number"
                value={newRule.conditions?.widthMin || ''}
                onChange={(e) => updateNewRuleCondition('widthMin', parseInt(e.target.value) || undefined)}
                placeholder="inches"
              />
            </div>
            <div>
              <Label>Max Width</Label>
              <Input
                type="number"
                value={newRule.conditions?.widthMax || ''}
                onChange={(e) => updateNewRuleCondition('widthMax', parseInt(e.target.value) || undefined)}
                placeholder="inches"
              />
            </div>
            <div>
              <Label>Min Height</Label>
              <Input
                type="number"
                value={newRule.conditions?.heightMin || ''}
                onChange={(e) => updateNewRuleCondition('heightMin', parseInt(e.target.value) || undefined)}
                placeholder="inches"
              />
            </div>
            <div>
              <Label>Max Height</Label>
              <Input
                type="number"
                value={newRule.conditions?.heightMax || ''}
                onChange={(e) => updateNewRuleCondition('heightMax', parseInt(e.target.value) || undefined)}
                placeholder="inches"
              />
            </div>
          </div>

          <Button onClick={addRule} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrinterAutoAssignment;