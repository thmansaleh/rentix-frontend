import { useCarBrands } from "./useCarBrands";
import { useLanguage } from "@/contexts/LanguageContext";

export const useBrandDisplay = () => {
  const { brands } = useCarBrands();
  const { language } = useLanguage();

  const getBrandName = (brandId) => {
    if (!brandId || !brands) return "";
    
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return "";
    
    return language === 'ar' ? brand.name_ar : brand.name_en;
  };

  const getBrandObject = (brandId) => {
    if (!brandId || !brands) return null;
    return brands.find(b => b.id === brandId) || null;
  };

  return { getBrandName, getBrandObject };
};
