'use client';
import { Settings, Palette, Database } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
const mockSettings = {
    appName: 'SAFE Medical Service Platform',
    systemEmail: 'noreply@safemedical.com',
    enableDarkMode: false,
    databaseBackupSchedule: 'Daily',
};
export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(mockSettings);
    const handleSettingChange = (name, value) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
        console.log(`Setting '${name}' changed to: ${value}`);
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[80vh]">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Admin Settings
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Manage system-wide application settings.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Settings className="h-7 w-7 mr-4 text-red-600 dark:text-red-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    General Settings
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="appName">Application Name</Label>
                                    <Input
                                        id="appName"
                                        value={settings.appName}
                                        onChange={(e) => handleSettingChange('appName', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="systemEmail">System Email Address</Label>
                                    <Input
                                        id="systemEmail"
                                        type="email"
                                        value={settings.systemEmail}
                                        onChange={(e) => handleSettingChange('systemEmail', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Palette className="h-7 w-7 mr-4 text-red-600 dark:text-red-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Theme Settings
                                </h2>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="darkMode"
                                    checked={settings.enableDarkMode}
                                    onCheckedChange={(checked) => handleSettingChange('enableDarkMode', checked)}
                                />
                                <Label htmlFor="darkMode">Enable Dark Mode</Label>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center mb-4">
                                <Database className="h-7 w-7 mr-4 text-red-600 dark:text-red-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Database Settings
                                </h2>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="backupSchedule">Database Backup Schedule</Label>
                                <Input
                                    id="backupSchedule"
                                    value={settings.databaseBackupSchedule}
                                    onChange={(e) => handleSettingChange('databaseBackupSchedule', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 