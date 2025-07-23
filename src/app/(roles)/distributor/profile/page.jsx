"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  getDistributorProfile,
  updateDistributorProfile,
} from "@/store/services/distributorApi";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function DistributorProfilePage() {
  const [profile, setProfile] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await getDistributorProfile();
        setProfile(res.data.data);
        setAvatarPreview(res.data.data.profileImage || "");
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setSuccess("");
    setError("");
    setAvatarFile(null);
    setAvatarPreview(profile.profileImage || "");
    getDistributorProfile()
      .then((res) => {
        setProfile(res.data.data);
        setAvatarPreview(res.data.data.profileImage || "");
      })
      .catch(() => {});
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    if (editing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      let updatedProfile = { ...profile };
      // Handle avatar upload if changed
      if (avatarFile) {
        // Simulate upload, replace with your actual upload logic
        // For demonstration, we'll just use a fake URL
        // In real app, upload to server and get the URL
        // Example: const imageUrl = await uploadImage(avatarFile);
        // updatedProfile.profileImage = imageUrl;
        // For now, just use preview as placeholder
        updatedProfile.profileImage = avatarPreview;
      }
      await updateDistributorProfile(updatedProfile);
      setProfile(updatedProfile);
      setSuccess("Profile updated!");
      setEditing(false);
      setAvatarFile(null);
    } catch {
      setError("Failed to update profile.");
    }
  };

  // Full page layout
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="flex flex-col md:flex-row w-full h-full flex-1">
        {/* Left: Avatar and Edit */}
        <div className="flex flex-col items-center justify-center md:w-1/3 w-full py-12 bg-white/80 dark:bg-card/80 border-r border-muted/30 min-h-[350px]">
          <div
            className={`relative group cursor-pointer transition-all`}
            onClick={handleAvatarClick}
            tabIndex={editing ? 0 : -1}
            style={{ outline: "none" }}
          >
            <div className="rounded-full bg-primary/10 shadow-inner flex items-center justify-center w-40 h-40 overflow-hidden border-4 border-primary/20">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-6xl font-bold text-primary flex items-center justify-center w-full h-full">
                  {getInitials(profile.companyName)}
                </span>
              )}
              {editing && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud className="w-10 h-10 text-white mb-2" />
                  <span className="text-white font-semibold">Change Photo</span>
                </div>
              )}
            </div>
            {editing && (
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            )}
          </div>
          <div className="mt-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-primary">{profile.companyName || "Distributor Profile"}</h2>
            <p className="text-muted-foreground mt-2 text-center">
              Manage your distributor information and contact details.
            </p>
            {!loading && !editing && (
              <Button
                variant="outline"
                onClick={handleEdit}
                className="mt-6 px-8 font-semibold rounded-full border border-primary/30 hover:bg-primary/10 transition"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
        {/* Right: Profile Form */}
        <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 md:px-16">
          <Card className="w-full max-w-2xl shadow-2xl border-0 rounded-3xl bg-white/90 dark:bg-card/80 backdrop-blur-md">
            <CardHeader className="p-8 border-b border-muted">
              <CardTitle className="text-2xl font-extrabold tracking-tight text-primary">
                Profile Details
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground text-base">
                Update your company and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
                  <span className="text-muted-foreground text-lg">Loading...</span>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <XCircle className="w-10 h-10 text-red-500 mb-2" />
                  <span className="text-red-500 text-lg">{error}</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSave}
                  className="space-y-8"
                  autoComplete="off"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2 font-semibold text-primary/90">
                        <Building2 className="w-4 h-4" />
                        Company Name
                      </Label>
                      <Input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) =>
                          handleChange("companyName", e.target.value)
                        }
                        required
                        disabled={!editing}
                        className={`rounded-xl shadow-sm ${
                          editing
                            ? "bg-white dark:bg-background"
                            : "bg-muted/30 dark:bg-muted/20"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2 font-semibold text-primary/90">
                        <User className="w-4 h-4" />
                        Contact Name
                      </Label>
                      <Input
                        type="text"
                        value={profile.contactName}
                        onChange={(e) =>
                          handleChange("contactName", e.target.value)
                        }
                        disabled={!editing}
                        className={`rounded-xl shadow-sm ${
                          editing
                            ? "bg-white dark:bg-background"
                            : "bg-muted/30 dark:bg-muted/20"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2 font-semibold text-primary/90">
                        <Mail className="w-4 h-4" />
                        Contact Email
                      </Label>
                      <Input
                        type="email"
                        value={profile.contactEmail}
                        onChange={(e) =>
                          handleChange("contactEmail", e.target.value)
                        }
                        disabled={!editing}
                        className={`rounded-xl shadow-sm ${
                          editing
                            ? "bg-white dark:bg-background"
                            : "bg-muted/30 dark:bg-muted/20"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="flex items-center gap-2 font-semibold text-primary/90">
                        <Phone className="w-4 h-4" />
                        Contact Phone
                      </Label>
                      <Input
                        type="text"
                        value={profile.contactPhone}
                        onChange={(e) =>
                          handleChange("contactPhone", e.target.value)
                        }
                        disabled={!editing}
                        className={`rounded-xl shadow-sm ${
                          editing
                            ? "bg-white dark:bg-background"
                            : "bg-muted/30 dark:bg-muted/20"
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-2">
                      <Label className="flex items-center gap-2 font-semibold text-primary/90">
                        <MapPin className="w-4 h-4" />
                        Address
                      </Label>
                      <Input
                        type="text"
                        value={profile.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        disabled={!editing}
                        className={`rounded-xl shadow-sm ${
                          editing
                            ? "bg-white dark:bg-background"
                            : "bg-muted/30 dark:bg-muted/20"
                        }`}
                      />
                    </div>
                  </div>
                  {editing && (
                    <div className="flex flex-wrap gap-4 mt-8 justify-end">
                      <Button
                        type="submit"
                        className="px-8 font-semibold rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:from-primary/90 hover:to-secondary/90 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Save Profile
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-8 font-semibold rounded-full border border-muted-foreground/30"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 text-green-600 mt-6 font-medium">
                      <CheckCircle2 className="w-5 h-5" />
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 mt-6 font-medium">
                      <XCircle className="w-5 h-5" />
                      {error}
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}