import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { User } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

export const UserProfile: React.FC = () => {
  const { profile, loadUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reload profile data when component mounts or when profile is null
  useEffect(() => {
    if (!profile) {
      console.log('Profile not found, loading user...');
      loadUser();
    }
  }, [profile, loadUser]);

  // Debug log to track profile changes
  useEffect(() => {
    console.log('UserProfile - profile changed:', profile);
  }, [profile]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Force reload profile when modal closes
    setTimeout(() => {
      loadUser();
    }, 100);
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mr-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'User Avatar'} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="text-primary-500" size={32} />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{profile.full_name || 'N/A'}</h3>
            <p className="text-secondary-600">Patient ID: {profile.id}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-secondary-600">Email</span>
            <span className="font-medium">{profile.email || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Age</span>
            <span className="font-medium">{profile.age || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Skin Type</span>
            <span className="font-medium">{profile.skin_type || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Dermatologist</span>
            <span className="font-medium">{profile.dermatologist || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-600">Role</span>
            <span className="font-medium">{profile.role || 'Patient'}</span>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={() => setIsModalOpen(true)} className="w-full btn-secondary py-2">
            Edit Profile
          </button>
        </div>
      </div>

      <EditProfileModal isOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};