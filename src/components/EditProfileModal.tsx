import React, { useState, useEffect } from 'react';
import { X, User, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, user, loadUser } = useAuthStore();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [skinType, setSkinType] = useState(profile?.skin_type || '');
  const [dermatologist, setDermatologist] = useState(profile?.dermatologist || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && profile) {
      setFullName(profile.full_name || '');
      setAge(profile.age?.toString() || '');
      setSkinType(profile.skin_type || '');
      setDermatologist(profile.dermatologist || '');
      setAvatarUrl(profile.avatar_url || '');
      setEmail(profile.email || '');
    }
  }, [isOpen, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Update all profile fields (database columns now exist)
      const updates: any = {
        full_name: fullName,
        age: age ? Number(age) : null,
        skin_type: skinType || null,
        dermatologist: dermatologist || null,
        email: email || null,
      };
      
      // Only add avatar_url if it has a value
      if (avatarUrl) {
        updates.avatar_url = avatarUrl;
      }

      console.log('Submitting profile update with data:', updates);
      console.log('Current user ID:', user.id);
      console.log('Current profile before update:', profile);

      const updatedProfile = await updateProfile(updates);

      console.log('Profile updated successfully:', updatedProfile);
      
      // Reload profile data to ensure UI is updated
      await loadUser();
      
      console.log('Profile reloaded, new profile:', useAuthStore.getState().profile);
      
      onClose();
    } catch (err) {
      console.error('Error in EditProfileModal.handleSubmit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Edit Profile</h3>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="text-primary-500" size={32} />
                  </div>
                )}
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
            </div>

            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min="1"
              max="120"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Skin Type
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Skin Type</option>
              <option value="Normal">Normal</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Combination">Combination</option>
              <option value="Sensitive">Sensitive</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Dermatologist Name
            </label>
            <input
              type="text"
              value={dermatologist}
              onChange={(e) => setDermatologist(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your dermatologist's name"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 px-4"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;