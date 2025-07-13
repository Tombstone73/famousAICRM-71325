import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GripVertical } from 'lucide-react';

export interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface ColumnManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  onColumnsChange: (columns: Column[]) => void;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({
  open,
  onOpenChange,
  columns,
  onColumnsChange
}) => {
  const handleVisibilityChange = (columnId: string, visible: boolean) => {
    const updatedColumns = columns.map(col => 
      col.id === columnId ? { ...col, visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    onColumnsChange(newColumns);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Columns</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {columns.map((column, index) => (
            <div key={column.id} className="flex items-center gap-3 p-2 border rounded">
              <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
              <Checkbox
                checked={column.visible}
                onCheckedChange={(checked) => 
                  handleVisibilityChange(column.id, checked as boolean)
                }
              />
              <span className="flex-1">{column.label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnManager;