import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface ProductionFiltersProps {
  selectedMedia: string;
  selectedPrinter: string;
  selectedPrintType: string;
  onMediaChange: (value: string) => void;
  onPrinterChange: (value: string) => void;
  onPrintTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

const ProductionFilters: React.FC<ProductionFiltersProps> = ({
  selectedMedia,
  selectedPrinter,
  selectedPrintType,
  onMediaChange,
  onPrinterChange,
  onPrintTypeChange,
  onClearFilters
}) => {
  const hasFilters = selectedMedia !== 'all' || selectedPrinter !== 'all' || selectedPrintType !== 'all';

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filter by:</span>
      </div>
      
      <Select value={selectedPrintType} onValueChange={onPrintTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Print Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="roll">Roll Printing</SelectItem>
          <SelectItem value="flatbed">Flatbed Printing</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedMedia} onValueChange={onMediaChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Media" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Media</SelectItem>
          <SelectItem value="vinyl">Vinyl</SelectItem>
          <SelectItem value="canvas">Canvas</SelectItem>
          <SelectItem value="paper">Paper</SelectItem>
          <SelectItem value="fabric">Fabric</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedPrinter} onValueChange={onPrinterChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Printer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Printers</SelectItem>
          <SelectItem value="HP-Latex-560">HP Latex 560</SelectItem>
          <SelectItem value="Epson-S80600">Epson S80600</SelectItem>
          <SelectItem value="Canon-Arizona">Canon Arizona</SelectItem>
          <SelectItem value="Mimaki-JFX200">Mimaki JFX200</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default ProductionFilters;