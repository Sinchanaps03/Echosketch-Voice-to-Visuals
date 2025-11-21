import React, { useState } from 'react';
import VoiceToImagePanel from './components/VoiceToImagePanel';
import MetricsPanel, { MetricsData } from './components/MetricsPanel';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editProfilePicture, setEditProfilePicture] = useState<string | undefined>('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [metricsData, setMetricsData] = useState<MetricsData>({
    inferenceTime: 0,
    accuracy: 0,
    generationTime: 0,
    confidenceScores: [],
    timestamps: [],
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const handleMetricsUpdate = (metrics: any) => {
    setMetricsData({
      inferenceTime: metrics.inferenceTime,
      accuracy: metrics.accuracy,
      generationTime: metrics.generationTime,
      confidenceScores: [85.2, 89.7, 92.3, 88.5, 94.1, 91.8],
      timestamps: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5', 'Step 6'],
    });
    setImageUrl(metrics.imageUrl);
    setPrompt(metrics.enhancedPrompt);
  };

  const handleLogout = () => {
    signOut();
    window.location.hash = '/signin';
  };

  const handleEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditProfilePicture(user?.profilePicture || '');
    setEditError(null);
    setEditSuccess(null);
    setShowUserMenu(false);
    setShowEditProfile(true);
  };

  const handleCancelEdit = () => {
    setShowEditProfile(false);
    setEditError(null);
    setEditSuccess(null);
  };

  const handleSaveProfile = async () => {
    setEditError(null);
    setEditSuccess(null);
    setIsUpdating(true);

    try {
      await updateProfile(editName, editEmail, editProfilePicture);
      setEditSuccess('Profile updated successfully.');
      setTimeout(() => {
        setShowEditProfile(false);
        setEditSuccess(null);
      }, 2000);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setEditError('Please upload a PNG or JPEG image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditProfilePicture(event.target?.result as string);
        setEditError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with User Menu */}
        <div className="flex justify-between items-start">
          {/* Title */}
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              ECHOSketch — Voice to Visual
            </h1>
            <p className="text-lg text-gray-400">
              Transform your voice into stunning visuals with AI
            </p>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-yellow-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <span className="text-sm truncate max-w-[120px] hidden sm:inline">{user?.name || user?.email}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-gray-700 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-yellow-400 flex items-center justify-center mb-3 overflow-hidden">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-400 truncate w-full text-center">{user?.email}</p>
                </div>
                <button
                  onClick={handleEditProfile}
                  className="w-full text-left px-4 py-2 text-sm text-purple-400 hover:bg-gray-700 transition-colors flex items-center gap-2 border-b border-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voice to Image Panel */}
        <VoiceToImagePanel onMetricsUpdate={handleMetricsUpdate} />

        {/* Metrics Panel - Only show if we have data */}
        {metricsData.inferenceTime > 0 && (
          <div className="pt-8 border-t border-gray-700/50">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Performance Analytics
            </h2>
            <MetricsPanel 
              metrics={metricsData} 
              imageUrl={imageUrl} 
              prompt={prompt} 
            />
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Edit Profile</h3>
            
            {/* Profile Picture Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-yellow-400 flex items-center justify-center mb-4 overflow-hidden">
                {editProfilePicture ? (
                  <img src={editProfilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
                Upload Profile Picture
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG or JPEG only</p>
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="edit-email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                id="edit-email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:border-purple-500 focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Error/Success Messages */}
            {editError && <p className="text-sm text-red-400 mb-4">{editError}</p>}
            {editSuccess && <p className="text-sm text-green-400 mb-4">{editSuccess}</p>}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
