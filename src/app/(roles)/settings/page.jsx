 'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Palette,
  Globe,
  Smartphone,
  Database,
  Trash2,
  Download,
  Upload,
  Key,
  LogOut,
  RefreshCw
} from 'lucide-react';
import PageHeader from '@/components/patient/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

const SettingsPage = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const userRole = user?.role?.toLowerCase() || 'patient';

  // Role-specific configurations
  const roleConfig = {
    patient: {
      title: "Patient Settings",
      description: "Manage your health profile and preferences",
      icon: "👤",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    doctor: {
      title: "Doctor Settings", 
      description: "Manage your professional profile and practice settings",
      icon: "👨‍⚕️",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    pharmacist: {
      title: "Pharmacist Settings",
      description: "Manage your pharmacy profile and inventory settings", 
      icon: "💊",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    admin: {
      title: "Admin Settings",
      description: "Manage system settings and user permissions",
      icon: "⚙️",
      color: "text-red-600", 
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    distributor: {
      title: "Distributor Settings",
      description: "Manage your distribution company settings",
      icon: "🚚",
      color: "text-orange-600",
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200"
    }
  };

  const currentRoleConfig = roleConfig[userRole] || roleConfig.patient;

  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    address: user?.address || '',
    profileImage: user?.profileImage || '',
    // Medical information (read-only for patients)
    emergencyContact: user?.emergencyContact || '',
    bloodType: user?.bloodType || '',
    allergies: user?.allergies || '',
    medicalConditions: user?.medicalConditions || '',
    // Role-specific fields
    specialty: user?.specialty || '',
    licenseNumber: user?.licenseNumber || '',
    experience: user?.experience || '',
    education: user?.education || '',
    pharmacyName: user?.pharmacyName || '',
    pharmacyLicense: user?.pharmacyLicense || '',
    companyName: user?.companyName || '',
    companyLicense: user?.companyLicense || '',
    adminLevel: user?.adminLevel || '',
    adminDepartment: user?.adminDepartment || ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    appointmentReminders: true,
    medicationReminders: true,
    consultationUpdates: true,
    prescriptionUpdates: true,
    healthTips: false,
    emergencyAlerts: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    // Role-specific notifications
    patientRequests: userRole === 'doctor' ? true : false,
    prescriptionRequests: userRole === 'pharmacist' ? true : false,
    inventoryAlerts: userRole === 'pharmacist' ? true : false,
    orderUpdates: userRole === 'distributor' ? true : false,
    systemAlerts: userRole === 'admin' ? true : false,
    userManagement: userRole === 'admin' ? true : false
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    shareMedicalHistory: false,
    sharePrescriptions: true,
    shareAppointments: true,
    allowResearch: false,
    dataAnalytics: true,
    thirdPartySharing: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: false,
    sessionTimeout: '30',
    passwordChangeRequired: false
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // UI State
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Filter out medical fields for patients
      const updateData = { ...profileData };
      
      if (userRole === 'patient') {
        // Remove medical fields from update data for patients
        delete updateData.emergencyContact;
        delete updateData.bloodType;
        delete updateData.allergies;
        delete updateData.medicalConditions;
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityToggle = (key) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlert({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAlert({ type: 'success', message: 'Data export completed! Check your email.' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to export data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        // Simulate account deletion
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push('/auth/login');
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to delete account' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const SettingItem = ({ icon: Icon, title, description, children, danger = false }) => (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${danger ? 'border-red-200 bg-red-50' : 'border-border bg-background'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${danger ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h4 className={`font-medium ${danger ? 'text-red-900' : 'text-foreground'}`}>{title}</h4>
          <p className={`text-sm ${danger ? 'text-red-700' : 'text-muted-foreground'}`}>{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      {/* Header */}
      <div className={`bg-white border-b ${currentRoleConfig.borderColor} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${currentRoleConfig.bgColor}`}>
                <span className="text-2xl">{currentRoleConfig.icon}</span>
              </div>
              <div>
                <PageHeader
                  title={currentRoleConfig.title}
                  description={currentRoleConfig.description}
                  breadcrumbs={[
                    { label: 'Dashboard', href: `/${userRole}/dashboard` },
                    { label: 'Settings', href: '/settings' }
                  ]}
                />
              </div>
            </div>
            <Badge variant="outline" className={`capitalize ${currentRoleConfig.color} ${currentRoleConfig.borderColor}`}>
              {userRole} Settings
            </Badge>
          </div>
        </div>
      </div>

      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert className={alert.type === 'error' ? 'border-destructive bg-destructive/10' : 'border-green-200 bg-green-50'}>
            <div className="flex items-center gap-2">
              {alert.type === 'error' ? <X className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertDescription>{alert.message}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${userRole === 'admin' ? 'grid-cols-6' : 'grid-cols-5'}`}>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            {userRole === 'admin' && (
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                System
              </TabsTrigger>
            )}
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.profileImage} />
                    <AvatarFallback className="text-lg">
                      {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={profileData.gender} onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <Separator />

                {/* Medical Information - Patient Only (Read Only) */}
                {userRole === 'patient' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Medical Information
                      <Badge variant="outline" className="text-xs">Read Only</Badge>
                    </h3>
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Medical information can only be updated by your healthcare providers. 
                        Contact your doctor or visit your medical records page to request updates.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bloodType" className="text-sm font-medium">Blood Type</Label>
                          <div className="mt-1 p-2 bg-background border border-border rounded text-sm">
                            {profileData.bloodType || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="emergencyContact" className="text-sm font-medium">Emergency Contact</Label>
                          <div className="mt-1 p-2 bg-background border border-border rounded text-sm">
                            {profileData.emergencyContact || 'Not specified'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div>
                          <Label htmlFor="allergies" className="text-sm font-medium">Allergies</Label>
                          <div className="mt-1 p-2 bg-background border border-border rounded text-sm min-h-[60px]">
                            {profileData.allergies || 'No allergies recorded'}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="medicalConditions" className="text-sm font-medium">Medical Conditions</Label>
                          <div className="mt-1 p-2 bg-background border border-border rounded text-sm min-h-[60px]">
                            {profileData.medicalConditions || 'No medical conditions recorded'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/patient/medical-records')}
                          className="flex items-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          View Medical Records
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleProfileUpdate} disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>

                {/* Role-specific Profile Sections */}
                {userRole === 'doctor' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className={`h-5 w-5 ${currentRoleConfig.color}`} />
                        Professional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="specialty">Specialty</Label>
                          <Input
                            id="specialty"
                            value={profileData.specialty}
                            onChange={(e) => setProfileData(prev => ({ ...prev, specialty: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="e.g., Cardiology, Pediatrics"
                          />
                        </div>
                        <div>
                          <Label htmlFor="licenseNumber">License Number</Label>
                          <Input
                            id="licenseNumber"
                            value={profileData.licenseNumber}
                            onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Medical license number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            value={profileData.experience}
                            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Years of practice"
                          />
                        </div>
                        <div>
                          <Label htmlFor="education">Education</Label>
                          <Input
                            id="education"
                            value={profileData.education}
                            onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Medical school, degrees"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'pharmacist' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className={`h-5 w-5 ${currentRoleConfig.color}`} />
                        Pharmacy Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                          <Input
                            id="pharmacyName"
                            value={profileData.pharmacyName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, pharmacyName: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Pharmacy name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pharmacyLicense">Pharmacy License</Label>
                          <Input
                            id="pharmacyLicense"
                            value={profileData.pharmacyLicense}
                            onChange={(e) => setProfileData(prev => ({ ...prev, pharmacyLicense: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Pharmacy license number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
                          <Textarea
                            id="pharmacyAddress"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Pharmacy address"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pharmacyPhone">Pharmacy Phone</Label>
                          <Input
                            id="pharmacyPhone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Pharmacy contact number"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'distributor' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className={`h-5 w-5 ${currentRoleConfig.color}`} />
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={profileData.companyName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, companyName: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyLicense">Company License</Label>
                          <Input
                            id="companyLicense"
                            value={profileData.companyLicense}
                            onChange={(e) => setProfileData(prev => ({ ...prev, companyLicense: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Company license number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyAddress">Company Address</Label>
                          <Textarea
                            id="companyAddress"
                            value={profileData.address}
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Company address"
                            rows={2}
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyPhone">Company Phone</Label>
                          <Input
                            id="companyPhone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Company contact number"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className={`h-5 w-5 ${currentRoleConfig.color}`} />
                        Administrative Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adminLevel">Admin Level</Label>
                          <Select value={profileData.adminLevel || 'standard'} onValueChange={(value) => setProfileData(prev => ({ ...prev, adminLevel: value }))} disabled={!isEditing}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select admin level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="super">Super Admin</SelectItem>
                              <SelectItem value="standard">Standard Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="adminDepartment">Department</Label>
                          <Input
                            id="adminDepartment"
                            value={profileData.adminDepartment || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, adminDepartment: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="Administrative department"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingItem
                  icon={Calendar}
                  title="Appointment Reminders"
                  description="Get notified about upcoming appointments"
                >
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={() => handleNotificationToggle('appointmentReminders')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Heart}
                  title="Medication Reminders"
                  description="Receive reminders for medication schedules"
                >
                  <Switch
                    checked={notificationSettings.medicationReminders}
                    onCheckedChange={() => handleNotificationToggle('medicationReminders')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Mail}
                  title="Consultation Updates"
                  description="Get notified when doctors respond to consultations"
                >
                  <Switch
                    checked={notificationSettings.consultationUpdates}
                    onCheckedChange={() => handleNotificationToggle('consultationUpdates')}
                  />
                </SettingItem>

                <SettingItem
                  icon={AlertTriangle}
                  title="Emergency Alerts"
                  description="Receive critical health alerts and notifications"
                >
                  <Switch
                    checked={notificationSettings.emergencyAlerts}
                    onCheckedChange={() => handleNotificationToggle('emergencyAlerts')}
                  />
                </SettingItem>

                <Separator />

                <h3 className="text-lg font-semibold">Notification Channels</h3>

                <SettingItem
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive notifications via email"
                >
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Smartphone}
                  title="SMS Notifications"
                  description="Receive notifications via text message"
                >
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={() => handleNotificationToggle('smsNotifications')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Bell}
                  title="Push Notifications"
                  description="Receive notifications in the app"
                >
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </SettingItem>

                {/* Role-specific Notification Settings */}
                {userRole === 'doctor' && (
                  <SettingItem
                    icon={User}
                    title="Patient Requests"
                    description="Get notified when patients request consultations"
                  >
                    <Switch
                      checked={notificationSettings.patientRequests}
                      onCheckedChange={() => handleNotificationToggle('patientRequests')}
                    />
                  </SettingItem>
                )}

                {userRole === 'pharmacist' && (
                  <>
                    <SettingItem
                      icon={Heart}
                      title="Prescription Requests"
                      description="Get notified when prescriptions are sent to your pharmacy"
                    >
                      <Switch
                        checked={notificationSettings.prescriptionRequests}
                        onCheckedChange={() => handleNotificationToggle('prescriptionRequests')}
                      />
                    </SettingItem>
                    <SettingItem
                      icon={AlertTriangle}
                      title="Inventory Alerts"
                      description="Get notified when medication stock is low"
                    >
                      <Switch
                        checked={notificationSettings.inventoryAlerts}
                        onCheckedChange={() => handleNotificationToggle('inventoryAlerts')}
                      />
                    </SettingItem>
                  </>
                )}

                {userRole === 'distributor' && (
                  <SettingItem
                    icon={Database}
                    title="Order Updates"
                    description="Get notified about order status changes"
                  >
                    <Switch
                      checked={notificationSettings.orderUpdates}
                      onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                    />
                  </SettingItem>
                )}

                {userRole === 'admin' && (
                  <>
                    <SettingItem
                      icon={AlertTriangle}
                      title="System Alerts"
                      description="Get notified about system issues and maintenance"
                    >
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={() => handleNotificationToggle('systemAlerts')}
                      />
                    </SettingItem>
                    <SettingItem
                      icon={User}
                      title="User Management"
                      description="Get notified about user registration and role changes"
                    >
                      <Switch
                        checked={notificationSettings.userManagement}
                        onCheckedChange={() => handleNotificationToggle('userManagement')}
                      />
                    </SettingItem>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy & Data Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingItem
                  icon={Database}
                  title="Share Medical History"
                  description="Allow doctors to view your complete medical history"
                >
                  <Switch
                    checked={privacySettings.shareMedicalHistory}
                    onCheckedChange={() => handlePrivacyToggle('shareMedicalHistory')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Heart}
                  title="Share Prescriptions"
                  description="Allow doctors to view your prescription history"
                >
                  <Switch
                    checked={privacySettings.sharePrescriptions}
                    onCheckedChange={() => handlePrivacyToggle('sharePrescriptions')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Calendar}
                  title="Share Appointments"
                  description="Allow doctors to view your appointment history"
                >
                  <Switch
                    checked={privacySettings.shareAppointments}
                    onCheckedChange={() => handlePrivacyToggle('shareAppointments')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Globe}
                  title="Allow Research"
                  description="Allow your anonymized data to be used for medical research"
                >
                  <Switch
                    checked={privacySettings.allowResearch}
                    onCheckedChange={() => handlePrivacyToggle('allowResearch')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Palette}
                  title="Data Analytics"
                  description="Allow data to be used for improving our services"
                >
                  <Switch
                    checked={privacySettings.dataAnalytics}
                    onCheckedChange={() => handlePrivacyToggle('dataAnalytics')}
                  />
                </SettingItem>

                <SettingItem
                  icon={AlertTriangle}
                  title="Third Party Sharing"
                  description="Allow data sharing with trusted third-party services"
                >
                  <Switch
                    checked={privacySettings.thirdPartySharing}
                    onCheckedChange={() => handlePrivacyToggle('thirdPartySharing')}
                  />
                </SettingItem>

                {/* Role-specific Privacy Settings */}
                {userRole === 'doctor' && (
                  <>
                    <SettingItem
                      icon={User}
                      title="Patient Data Access"
                      description="Allow patients to view your professional information"
                    >
                      <Switch
                        checked={privacySettings.shareMedicalHistory}
                        onCheckedChange={() => handlePrivacyToggle('shareMedicalHistory')}
                      />
                    </SettingItem>
                    <SettingItem
                      icon={Calendar}
                      title="Schedule Visibility"
                      description="Allow patients to see your available appointment slots"
                    >
                      <Switch
                        checked={privacySettings.shareAppointments}
                        onCheckedChange={() => handlePrivacyToggle('shareAppointments')}
                      />
                    </SettingItem>
                  </>
                )}

                {userRole === 'pharmacist' && (
                  <>
                    <SettingItem
                      icon={Heart}
                      title="Prescription History"
                      description="Allow doctors to view prescription fulfillment history"
                    >
                      <Switch
                        checked={privacySettings.sharePrescriptions}
                        onCheckedChange={() => handlePrivacyToggle('sharePrescriptions')}
                      />
                    </SettingItem>
                    <SettingItem
                      icon={Database}
                      title="Inventory Visibility"
                      description="Allow doctors to see available medications"
                    >
                      <Switch
                        checked={privacySettings.shareMedicalHistory}
                        onCheckedChange={() => handlePrivacyToggle('shareMedicalHistory')}
                      />
                    </SettingItem>
                  </>
                )}

                {userRole === 'admin' && (
                  <>
                    <SettingItem
                      icon={User}
                      title="User Analytics"
                      description="Allow collection of user behavior analytics"
                    >
                      <Switch
                        checked={privacySettings.dataAnalytics}
                        onCheckedChange={() => handlePrivacyToggle('dataAnalytics')}
                      />
                    </SettingItem>
                    <SettingItem
                      icon={Database}
                      title="System Monitoring"
                      description="Allow system performance monitoring"
                    >
                      <Switch
                        checked={privacySettings.thirdPartySharing}
                        onCheckedChange={() => handlePrivacyToggle('thirdPartySharing')}
                      />
                    </SettingItem>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  icon={Key}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                >
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={() => handleSecurityToggle('twoFactorAuth')}
                  />
                </SettingItem>

                <SettingItem
                  icon={Smartphone}
                  title="Biometric Authentication"
                  description="Use fingerprint or face recognition to log in"
                >
                  <Switch
                    checked={securitySettings.biometricAuth}
                    onCheckedChange={() => handleSecurityToggle('biometricAuth')}
                  />
                </SettingItem>

                <div className="space-y-4">
                  <Label htmlFor="sessionTimeout">Session Timeout</Label>
                  <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Password Change */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handlePasswordChange} disabled={isLoading}>
                      <Lock className="h-4 w-4 mr-2" />
                      {isLoading ? 'Changing Password...' : 'Change Password'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingItem
                  icon={Download}
                  title="Export Data"
                  description="Download a copy of your personal data"
                >
                  <Button variant="outline" onClick={handleDataExport} disabled={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Exporting...' : 'Export'}
                  </Button>
                </SettingItem>

                <SettingItem
                  icon={Upload}
                  title="Import Data"
                  description="Import your data from another service"
                >
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </SettingItem>

                {/* Role-specific Account Features */}
                {userRole === 'doctor' && (
                  <SettingItem
                    icon={Calendar}
                    title="Schedule Management"
                    description="Manage your availability and appointment settings"
                  >
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Schedule
                    </Button>
                  </SettingItem>
                )}

                {userRole === 'pharmacist' && (
                  <SettingItem
                    icon={Database}
                    title="Inventory Management"
                    description="Manage your pharmacy inventory and stock levels"
                  >
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Manage Inventory
                    </Button>
                  </SettingItem>
                )}

                {userRole === 'doctor' && (
                  <SettingItem
                    icon={Calendar}
                    title="Schedule Management"
                    description="Manage your availability and appointment settings"
                  >
                    <Button variant="outline" onClick={() => router.push('/doctor/appointments')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Schedule
                    </Button>
                  </SettingItem>
                )}

                {userRole === 'pharmacist' && (
                  <SettingItem
                    icon={Database}
                    title="Inventory Management"
                    description="Manage your pharmacy inventory and stock levels"
                  >
                    <Button variant="outline" onClick={() => router.push('/pharmacist/inventory')}>
                      <Database className="h-4 w-4 mr-2" />
                      Manage Inventory
                    </Button>
                  </SettingItem>
                )}

                {userRole === 'distributor' && (
                  <SettingItem
                    icon={Database}
                    title="Order Management"
                    description="Manage your distribution orders and deliveries"
                  >
                    <Button variant="outline" onClick={() => router.push('/distributor/orders')}>
                      <Database className="h-4 w-4 mr-2" />
                      Manage Orders
                    </Button>
                  </SettingItem>
                )}

                {userRole === 'admin' && (
                  <>
                    <SettingItem
                      icon={User}
                      title="User Management"
                      description="Manage system users and permissions"
                    >
                      <Button variant="outline" onClick={() => router.push('/admin/users')}>
                        <User className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                    </SettingItem>
                    <SettingItem
                      icon={Settings}
                      title="System Settings"
                      description="Configure system-wide settings and preferences"
                    >
                      <Button variant="outline" onClick={() => router.push('/admin/settings')}>
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings
                      </Button>
                    </SettingItem>
                  </>
                )}

                <Separator />

                <SettingItem
                  icon={Trash2}
                  title="Delete Account"
                  description="Permanently delete your account and all associated data"
                  danger={true}
                >
                  <Button variant="destructive" onClick={handleAccountDeletion} disabled={isLoading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </SettingItem>

                <SettingItem
                  icon={LogOut}
                  title="Sign Out"
                  description="Sign out of your account on all devices"
                >
                  <Button variant="outline">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </SettingItem>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings - Admin Only */}
          {userRole === 'admin' && (
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    System Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        User Management
                      </h3>
                      <SettingItem
                        icon={User}
                        title="User Registration"
                        description="Control new user registration settings"
                      >
                        <Switch defaultChecked />
                      </SettingItem>
                      <SettingItem
                        icon={Shield}
                        title="Role Assignment"
                        description="Allow automatic role assignment"
                      >
                        <Switch defaultChecked />
                      </SettingItem>
                      <SettingItem
                        icon={AlertTriangle}
                        title="Account Verification"
                        description="Require email verification for new accounts"
                      >
                        <Switch defaultChecked />
                      </SettingItem>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Database className="h-5 w-5 text-green-500" />
                        System Settings
                      </h3>
                      <SettingItem
                        icon={Globe}
                        title="Maintenance Mode"
                        description="Enable system maintenance mode"
                      >
                        <Switch />
                      </SettingItem>
                      <SettingItem
                        icon={Database}
                        title="Data Backup"
                        description="Enable automatic data backup"
                      >
                        <Switch defaultChecked />
                      </SettingItem>
                      <SettingItem
                        icon={Palette}
                        title="System Theme"
                        description="Default system theme"
                      >
                        <Select defaultValue="light">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </SettingItem>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      System Actions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Backup Database
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;