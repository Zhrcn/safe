'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/Select';
import { useTranslation } from 'react-i18next';

export function AdminSettingsPanel() {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="p-6 mt-6 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">{t('admin.settings.title')}</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span>{t('admin.settings.darkMode')}</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
        <div className="flex items-center justify-between">
          <span>{t('admin.settings.userRegistration')}</span>
          <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
        </div>
        <div className="flex items-center justify-between">
          <span>{t('admin.settings.maintenanceMode')}</span>
          <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
        </div>
        <div className="flex items-center justify-between">
          <span>{t('admin.settings.defaultLanguage')}</span>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t('admin.settings.english')}</SelectItem>
              <SelectItem value="ar">{t('admin.settings.arabic')}</SelectItem>
              <SelectItem value="fr">{t('admin.settings.french')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full mt-4" onClick={handleSave}>{t('admin.settings.save')}</Button>
        {saved && <div className="text-green-600 text-center mt-2">{t('admin.settings.saved')}</div>}
      </div>
    </Card>
  );
} 