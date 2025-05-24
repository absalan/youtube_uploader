
import React, { useState } from 'react';
import VideoUploadForm from '../components/videos/VideoUploadForm';
import VideoList from '../components/videos/VideoList';
import { Video } from '../types';
import { useAuth } from '../hooks/useAuth';
import { YOUTUBE_CONNECT_URL } from '../constants';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const DashboardPage: React.FC = () => {
  const [newUploadedVideo, setNewUploadedVideo] = useState<Video | null>(null);
  const { user, isYoutubeConnected, youtubeChannelName } = useAuth();

  const handleUploadSuccess = (video: Video) => {
    setNewUploadedVideo(video);
  };

  if (!user) return null; // Should be handled by ProtectedRoute

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user.name}!</h1>
        <p className="text-gray-600">Manage your videos and YouTube uploads.</p>
        
        {!isYoutubeConnected && (
          <Alert 
            type="info"
            message={
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <p>Connect your YouTube account to upload videos directly to your channel.</p>
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
            message={`Connected to YouTube channel: ${youtubeChannelName}`}
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
