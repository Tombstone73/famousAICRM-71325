import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Zap } from 'lucide-react';

interface PriorityFlagProps {
  dueDate: string;
  priority: 'Normal' | 'Rush' | 'Urgent';
}

const PriorityFlag: React.FC<PriorityFlagProps> = ({ dueDate, priority }) => {
  const calculatePriorityStatus = () => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', color: 'bg-red-500 text-white', icon: AlertTriangle };
    } else if (diffDays === 0) {
      return { status: 'due-today', color: 'bg-orange-500 text-white', icon: Zap };
    } else if (diffDays === 1) {
      return { status: 'due-tomorrow', color: 'bg-yellow-500 text-white', icon: Clock };
    } else if (diffDays <= 3) {
      return { status: 'due-soon', color: 'bg-blue-500 text-white', icon: Clock };
    } else {
      return { status: 'normal', color: 'bg-green-500 text-white', icon: Clock };
    }
  };

  const { status, color, icon: Icon } = calculatePriorityStatus();
  
  const getStatusText = () => {
    switch (status) {
      case 'overdue': return 'OVERDUE';
      case 'due-today': return 'DUE TODAY';
      case 'due-tomorrow': return 'DUE TOMORROW';
      case 'due-soon': return 'DUE SOON';
      default: return priority.toUpperCase();
    }
  };

  return (
    <Badge className={`${color} font-semibold`}>
      <Icon className="w-3 h-3 mr-1" />
      {getStatusText()}
    </Badge>
  );
};

export default PriorityFlag;