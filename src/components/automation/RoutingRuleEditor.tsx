import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Save, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TestResult {
  passed: boolean;
  message: string;
  details?: string;
}

interface RoutingRule {
  name: string;
  conditions: { field: string; operator: string; value: string; }[];
  actions: { type: string; target: string; }[];
  enabled: boolean;
}

const RoutingRuleEditor: React.FC = () => {
  const [rule, setRule] = useState<RoutingRule>({
    name: '',
    conditions: [{ field: '', operator: '', value: '' }],
    actions: [{ type: '', target: '' }],
    enabled: true
  });

  const [testData, setTestData] = useState({
    priority: 'normal',
    dueDate: '2024-01-20',
    width: '8.5',
    height: '11',
    quantity: '100',
    customerType: 'business',
    productType: 'business_card',
    material: 'cardstock'
  });

  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const fieldOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'width', label: 'Width' },
    { value: 'height', label: 'Height' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'customerType', label: 'Customer Type' },
    { value: 'productType', label: 'Product Type' },
    { value: 'material', label: 'Material' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'contains', label: 'Contains' }
  ];

  const actionTypes = [
    { value: 'route_to_queue', label: 'Route to Queue' },
    { value: 'assign_printer', label: 'Assign Printer' },
    { value: 'set_priority', label: 'Set Priority' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'require_approval', label: 'Require Approval' }
  ];

  const addCondition = () => {
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, { field: '', operator: '', value: '' }]
    }));
  };

  const removeCondition = (index: number) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: string, value: string) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const addAction = () => {
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: '', target: '' }]
    }));
  };

  const removeAction = (index: number) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const updateAction = (index: number, field: string, value: string) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) => 
        i === index ? { ...a, [field]: value } : a
      )
    }));
  };

  const testRule = async () => {
    setIsTestRunning(true);
    setTestResults([]);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: TestResult[] = [];
    
    rule.conditions.forEach((condition, index) => {
      if (!condition.field || !condition.operator || !condition.value) {
        results.push({
          passed: false,
          message: `Condition ${index + 1}: Incomplete condition`,
          details: 'All fields must be filled'
        });
        return;
      }
      
      const testValue = testData[condition.field as keyof typeof testData];
      let passed = false;
      
      switch (condition.operator) {
        case 'equals':
          passed = testValue === condition.value;
          break;
        case 'notEquals':
          passed = testValue !== condition.value;
          break;
        case 'greaterThan':
          passed = parseFloat(testValue) > parseFloat(condition.value);
          break;
        case 'lessThan':
          passed = parseFloat(testValue) < parseFloat(condition.value);
          break;
        case 'contains':
          passed = testValue.toLowerCase().includes(condition.value.toLowerCase());
          break;
        default:
          passed = false;
      }
      
      results.push({
        passed,
        message: `Condition ${index + 1}: ${condition.field} ${condition.operator} ${condition.value}`,
        details: `Test: ${testValue} vs ${condition.value} = ${passed ? 'PASS' : 'FAIL'}`
      });
    });
    
    rule.actions.forEach((action, index) => {
      if (!action.type || !action.target) {
        results.push({
          passed: false,
          message: `Action ${index + 1}: Incomplete action`,
          details: 'Action type and target must be specified'
        });
      } else {
        results.push({
          passed: true,
          message: `Action ${index + 1}: ${action.type} -> ${action.target}`,
          details: 'Action configuration is valid'
        });
      }
    });
    
    setTestResults(results);
    setIsTestRunning(false);
  };

  const saveRule = () => {
    console.log('Saving rule:', rule);
    alert('Rule saved successfully!');
  };

  const resetRule = () => {
    setRule({
      name: '',
      conditions: [{ field: '', operator: '', value: '' }],
      actions: [{ type: '', target: '' }],
      enabled: true
    });
    setTestResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Routing Rule Editor</CardTitle>
          <CardDescription>
            Create and test routing rules to automate job processing workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="ruleName">Rule Name</Label>
            <Input
              id="ruleName"
              value={rule.name}
              onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name"
            />
          </div>

          <div>
            <Label className="text-base font-semibold">Conditions</Label>
            <p className="text-sm text-gray-600 mb-3">Define when this rule should be applied</p>
            {rule.conditions.map((condition, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Select value={condition.field} onValueChange={(value) => updateCondition(index, 'field', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldOptions.map(field => (
                      <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={condition.operator} onValueChange={(value) => updateCondition(index, 'operator', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatorOptions.map(op => (
                      <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  value={condition.value}
                  onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  placeholder="Value"
                />
                {rule.conditions.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeCondition(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addCondition}>
              Add Condition
            </Button>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-semibold">Actions</Label>
            <p className="text-sm text-gray-600 mb-3">Define what should happen when conditions are met</p>
            {rule.actions.map((action, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Select value={action.type} onValueChange={(value) => updateAction(index, 'type', value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  value={action.target}
                  onChange={(e) => updateAction(index, 'target', e.target.value)}
                  placeholder="Target (queue, printer, etc.)"
                />
                {rule.actions.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeAction(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addAction}>
              Add Action
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button onClick={saveRule}>
              <Save className="h-4 w-4 mr-2" />
              Save Rule
            </Button>
            <Button variant="outline" onClick={resetRule}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rule Tester</CardTitle>
          <CardDescription>
            Test your routing rule with sample data to verify it works as expected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(testData).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  id={key}
                  value={value}
                  onChange={(e) => setTestData(prev => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <Button 
            onClick={testRule} 
            disabled={isTestRunning || !rule.name}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            {isTestRunning ? 'Testing...' : 'Test Rule'}
          </Button>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">Test Results</Label>
              {testResults.map((result, index) => (
                <Alert key={index} className={result.passed ? 'border-green-200' : 'border-red-200'}>
                  <div className="flex items-center space-x-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium">{result.message}</div>
                        {result.details && (
                          <div className="text-sm text-gray-600 mt-1">{result.details}</div>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutingRuleEditor;