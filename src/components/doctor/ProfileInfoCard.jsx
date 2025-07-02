import React from 'react';
import { Button } from '@/components/ui/Button';

const ProfileInfoCard = ({ profile, onEdit, onAddEducation, onAddAchievement }) => (
  <div className="bg-card rounded-2xl shadow-lg border border-border p-6 flex flex-col md:flex-row items-center gap-6">
    <img
      src={profile?.profileImage || '/placeholder-avatar.jpg'}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow"
    />
    <div className="flex-1 w-full">
      <h2 className="text-2xl font-bold text-card-foreground mb-1">{profile?.name}</h2>
      <p className="text-primary font-semibold mb-2">{profile?.specialty}</p>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
        <div><span className="font-medium text-card-foreground">Email:</span> {profile?.contact?.email}</div>
        <div><span className="font-medium text-card-foreground">Phone:</span> {profile?.contact?.phone}</div>
        <div><span className="font-medium text-card-foreground">License:</span> {profile?.licenseNumber}</div>
        <div><span className="font-medium text-card-foreground">Experience:</span> {profile?.experienceYears} years</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="primary" onClick={onEdit}>Edit Profile</Button>
        <Button variant="outline" onClick={onAddEducation}>Add Education</Button>
        <Button variant="secondary" onClick={onAddAchievement}>Add Achievement</Button>
      </div>
    </div>
  </div>
);

export default ProfileInfoCard; 