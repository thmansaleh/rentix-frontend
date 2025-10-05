'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/hooks/useTranslations';

const PartiesSearchForm = ({ onSearch }) => {
  const { isRTL } = useLanguage();
  const { t } = useTranslations();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    party_type: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = {};
    
    if (formData.name) searchParams.name = formData.name;
    if (formData.phone) searchParams.phone = formData.phone;
    if (formData.party_type) searchParams.party_type = formData.party_type;
    
    onSearch(searchParams);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      party_type: '',
    });
    onSearch({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Name Search */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('partiesPage.searchByName')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('partiesPage.searchByNamePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            {/* Phone Search */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('partiesPage.searchByPhone')}</Label>
              <Input
                id="phone"
                type="text"
                placeholder={t('partiesPage.searchByPhonePlaceholder')}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            {/* Party Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="party_type">{t('partiesPage.partyType')}</Label>
              <Select
                value={formData.party_type}
                onValueChange={(value) => handleInputChange('party_type', value)}
              >
                <SelectTrigger id="party_type" className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue placeholder={t('partiesPage.selectPartyType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عميل">{t('partiesPage.client')}</SelectItem>
                  <SelectItem value="خصم">{t('partiesPage.opponent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-start'}`}>
            <Button type="submit" className="gap-2">
              <Search className="w-4 h-4" />
              {t('buttons.search')}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
              <X className="w-4 h-4" />
              {t('buttons.reset')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PartiesSearchForm;
