import React from 'react';
import { useBrandDisplay } from '@/hooks/useBrandDisplay';

export const BrandDisplayName = ({ brandId, className = "" }) => {
  const { getBrandName } = useBrandDisplay();
  
  const brandName = getBrandName(brandId);
  
  if (!brandName) {
    return <span className={className}>-</span>;
  }
  
  return <span className={className}>{brandName}</span>;
};

export default BrandDisplayName;
