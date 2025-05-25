
import React, { useState, useEffect } from 'react';
import VideoUploadForm from '../components/videos/VideoUploadForm';
import VideoList from '../components/videos/VideoList';
import { Video } from '../types';
import { useAuth } from '../hooks/useAuth';
import { YOUTUBE_CONNECT_URL } from '../constants';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const DashboardPage: React.FC = () => {
  const [newUploadedVideo, setNewUploadedVideo] = useState<Video | null>(null);
  const { user, isYoutubeConnected, youtubeChannelName, loading: authLoading } = useAuth();

  useEffect(() => {
    // This log helps observe the state DashboardPage receives from AuthContext.
    // On refresh, 'user' should transition from null to a user object if fetch is successful.
    // 'authLoading' should transition from true to false.
    console.log('[DashboardPage] Auth State Received:', { user, isYoutubeConnected, authLoading });
  }, [user, isYoutubeConnected, authLoading]);

  const handleUploadSuccess = (video: Video) => {
    setNewUploadedVideo(video);
  };

  // ProtectedRoute handles the loading state and ensures 'user' is non-null when this component renders.
  // If 'user' were null here, it would mean ProtectedRoute isn't working as expected,
  // or there's a race condition where DashboardPage renders before ProtectedRoute redirects.
  // However, the standard behavior is that ProtectedRoute will prevent rendering of DashboardPage
  // if authLoading is true or if user is null after loading.

  // Therefore, we can directly use `user` assuming ProtectedRoute has done its job.
  // If user is null here, `user.name` would error. ProtectedRoute should prevent this.
  // If there's still an issue, the console log above will be very informative.

  if (!user) {
    // This case should ideally not be reached if ProtectedRoute is functioning correctly.
    // It's a fallback or indicates a deeper issue if `user` is null here post-authLoading.
    console.error("[DashboardPage] Rendered with null user despite ProtectedRoute. This shouldn't happen.");
    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg text-gray-700 dark:text-gray-300">Loading user data or critical error...</p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl">
        {/* Ensure user is not null before accessing properties */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome0, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your videos and YouTube uploads.</p>
        
        {!isYoutubeConnected && (
          <Alert 
            type="info"
            message={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <p className="dark:text-blue-200">Connect your YouTube account to upload videos directly to your channel.</p>
                <a href={YOUTUBE_CONNECT_URL} className="mt-2 sm:mt-0 sm:ml-4">
                  <Button variant="primary" size="sm">Connect to YouTube</Button>
                </a>
              </div>
            } 
            className="mt-4"
          />
        )}
        {isYoutubeConnected && youtubeChannelName && (
          <Alert 
            type="success"
            message={<span className="dark:text-green-200">{`Connected to YouTube channel: ${youtubeChannelName}`}</span>}
            className="mt-4"
          />
        )}
      </div>

      <VideoUploadForm onUploadSuccess={handleUploadSuccess} />
      <VideoList newUploadedVideo={newUploadedVideo} />
    </div>
  );
};

export default DashboardPage;
