import React from 'react';
import { ProductImageUpload } from './ProductImageUpload';

interface MultiImageUploadProps {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  productId: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = (props) => {
  return <ProductImageUpload {...props} />;
};