'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Award, GraduationCap, Languages, Star, Clock, Shield, Briefcase, Building2 } from 'lucide-react';
import { PharmacistPageContainer } from '@/components/pharmacist/PharmacistComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage, getImageUrl } from '@/components/ui/Avatar';
import ImageUploader from '@/components/ui/ImageUploader';
import { getPharmacistProfile, updatePharmacistProfile } from '@/services/pharmacistService';

export default function PharmacistProfilePage() {
  const [pharmacist, setPharmacist] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getPharmacistProfile();
        setPharmacist(data);
        setFormData({ ...data });
      } catch (error) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...pharmacist });
    setPreviewImage(null);
  };
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...pharmacist });
    setPreviewImage(null);
    setError(null);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (imageUrl) => {
    setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
  };
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Filter out fields that shouldn't be sent to the backend
      const { _id, userId, pharmacistId, email, role, ...payload } = formData;
      console.log('Sending payload:', payload);
      const updated = await updatePharmacistProfile(payload);
      setPharmacist(updated);
      setFormData({ ...updated });
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PharmacistPageContainer
        title="Pharmacist Profile"
        description="Loading profile information..."
      >
        <div className="flex justify-center items-center h-64">
          <p>Loading profile data...</p>
        </div>
      </PharmacistPageContainer>
    );
  }

  if (error) {
    return (
      <PharmacistPageContainer
        title="Pharmacist Profile"
        description="Error loading profile information."
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-red-600">{error}</p>
        </div>
      </PharmacistPageContainer>
    );
  }

  const data = isEditing ? formData : pharmacist;

  return (
    <PharmacistPageContainer
      title="Pharmacist Profile"
      description="Your professional and personal information."
    >
      <div className="w-full flex flex-col md:flex-row gap-8 items-start bg-background rounded-2xl p-6 shadow-lg">
        <div className="md:w-1/3 w-full flex flex-col items-center">
          <Card className="w-full bg-card text-card-foreground shadow-2xl rounded-2xl border border-border p-4 transition-shadow hover:shadow-3xl">
            <CardContent className="flex flex-col items-center text-center p-12 min-h-[650px] bg-card text-card-foreground rounded-2xl border border-border shadow-lg">
              <div className="w-full flex flex-col items-center">
                {isEditing ? (
                  <ImageUploader
                    onImageUpload={handleImageUpload}
                    previewImage={previewImage}
                    setPreviewImage={setPreviewImage}
                    userId={data._id}
                    firstName={data.firstName}
                    lastName={data.lastName}
                    size="lg"
                    className="mb-2"
                  />
                ) : (
                  <Avatar className="w-32 h-32 mb-4 shadow-lg border-4 border-background bg-card">
                    <AvatarImage src={getImageUrl(data.profileImage)} alt="Profile Picture" className="object-cover" />
                    {(!data.profileImage || data.profileImage === '' || data.profileImage === null) && (
                      <AvatarFallback className="text-4xl font-bold bg-muted text-muted-foreground">
                        {data.firstName?.[0]}{data.lastName?.[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <div className="w-full border-b border-border my-4"></div>
              </div>
              <h2 className="text-3xl font-extrabold mb-2 text-card-foreground flex items-center gap-2">
                <User className="h-7 w-7 text-primary" />
                {isEditing ? (
                  <>
                    <Input name="firstName" value={data.firstName || ''} onChange={handleChange} className="w-28 inline-block mr-1 bg-muted text-card-foreground border-border" />
                    <Input name="lastName" value={data.lastName || ''} onChange={handleChange} className="w-28 inline-block bg-muted text-card-foreground border-border" />
                  </>
                ) : (
                  <>{data.firstName} {data.lastName}</>
                )}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-xs font-semibold">Active</span>
              </div>
              <div className="flex flex-col gap-1 text-base text-muted-foreground mb-2">
                <span className="flex items-center gap-1"><Mail className="h-4 w-4 text-primary" />{data.email}</span>
                <span className="flex items-center gap-1"><Phone className="h-4 w-4 text-primary" />{isEditing ? <Input name="phoneNumber" value={data.phoneNumber || ''} onChange={handleChange} className="w-36 inline-block bg-muted text-card-foreground border-border" /> : data.phoneNumber}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" />{isEditing ? <Input name="address" value={data.address || ''} onChange={handleChange} className="w-36 inline-block bg-muted text-card-foreground border-border" /> : data.address}</span>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground mt-2">
                <span>License: <span className="font-semibold text-card-foreground">{data.licenseNumber}</span></span>
                <span>Pharmacy: <span className="font-semibold text-card-foreground">{data.pharmacyName}</span></span>
              </div>
              <div className="mt-4">
                {!isEditing ? (
                  <Button variant="outline" onClick={handleEdit} className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="success" onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button variant="destructive" onClick={handleCancel} disabled={saving} className="flex items-center gap-2">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                )}
              </div>
              {error && (
                <div className="text-error text-sm mt-2">{error}</div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3 w-full flex flex-col gap-8">
          <Card className="bg-card text-card-foreground rounded-2xl border border-border shadow-md p-4">
            <CardHeader className="pb-2 border-b border-border mb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-primary"><User className="h-6 w-6" /> Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-0">
              <div>
                <Label className="text-xs text-muted-foreground">Gender</Label>
                {isEditing ? (
                  <Input name="gender" value={data.gender || ''} onChange={handleChange} className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.gender}</div>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                {isEditing ? (
                  <Input name="dateOfBirth" value={data.dateOfBirth || ''} onChange={handleChange} type="date" className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : ''}</div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground rounded-2xl border border-border shadow-md p-4">
            <CardHeader className="pb-2 border-b border-border mb-4">
              <CardTitle className="flex items-center gap-2 text-xl text-success"><Briefcase className="h-6 w-6" /> Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-0">
              <div>
                <Label className="text-xs text-muted-foreground">License Number</Label>
                {isEditing ? (
                  <Input name="licenseNumber" value={data.licenseNumber || ''} onChange={handleChange} className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.licenseNumber}</div>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Pharmacy Name</Label>
                {isEditing ? (
                  <Input name="pharmacyName" value={data.pharmacyName || ''} onChange={handleChange} className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.pharmacyName}</div>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Years of Experience</Label>
                {isEditing ? (
                  <Input name="yearsOfExperience" value={data.yearsOfExperience || ''} onChange={handleChange} type="number" className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.yearsOfExperience}</div>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Qualifications</Label>
                {isEditing ? (
                  <Input name="qualifications" value={Array.isArray(data.qualifications) ? data.qualifications.join(', ') : data.qualifications || ''} onChange={handleChange} className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{Array.isArray(data.qualifications) ? data.qualifications.join(', ') : data.qualifications}</div>
                )}
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground">Professional Bio</Label>
                {isEditing ? (
                  <Input name="professionalBio" value={data.professionalBio || ''} onChange={handleChange} className="bg-muted text-card-foreground border-border" />
                ) : (
                  <div className="font-medium text-card-foreground text-lg">{data.professionalBio}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacistPageContainer>
  );
}