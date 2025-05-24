
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { YOUTUBE_CONNECT_URL } from '../constants';


const YoutubeConnectIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path d="M19.615 3.185a.75.75 0 00-.521-.219H4.906a.75.75 0 00-.522.219C3.685 3.862 3 4.93 3 6.125v11.75c0 1.194.685 2.262 1.385 2.94a.751.751 0 00.522.219h14.187a.75.75 0 00.522-.219c.7-.678 1.385-1.746 1.385-2.94V6.125c0-1.194-.685-2.262-1.385-2.94zM8.25 15.875V8.125l6.75 3.875-6.75 3.875z" />
  </svg>
);


const SettingsPage: React.FC = () => {
  const location = useLocation();
  const { user, fetchUser, isYoutubeConnected, youtubeChannelName, loading: authLoading } = useAuth();
  const [message, setMessage] = useState<React.ReactNode | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const youtubeConnectedParam = queryParams.get('youtube_connected');
    const errorParam = queryParams.get('youtube_error');
    
    setIsLoading(true); 
    
    fetchUser().then(() => {
      if (youtubeConnectedParam === 'true') {
        setMessage(`Successfully connected to YouTube! ${user?.youtube_channel_name ? `Channel: ${user.youtube_channel_name}` : ''}`);
        setMessageType('success');
      } else if (errorParam) {
        setMessage(`Failed to connect YouTube: ${decodeURIComponent(errorParam)}`);
        setMessageType('error');
      } else if (user?.is_youtube_connected) {
         setMessage(`YouTube is connected. Channel: ${user.youtube_channel_name || 'N/A'}`);
         setMessageType('success');
      } else {
         setMessage('Manage your YouTube connection settings.');
         setMessageType('info');
      }
      setIsLoading(false);
    }).catch(() => {
      setMessage('Could not retrieve latest YouTube connection status.');
      setMessageType('error');
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, fetchUser]); 

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl rounded-lg min-h-[300px]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl dark:shadow-2xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
      
      {message && <Alert type={messageType} message={message} />}

      <div className="mt-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">YouTube Connection</h2>
        {isYoutubeConnected ? (
          <div>
            <p className="text-green-600 dark:text-green-400 mb-2 flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.06 0l4-5.5Z" clipRule="evenodd" /></svg>
              Connected as: <span className="font-medium ml-1">{youtubeChannelName || 'Your YouTube Channel'}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You can now upload videos directly to your YouTube channel.</p>
            {/* Optionally add a disconnect button here if backend supports it */}
          </div>
        ) : (
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Connect your YouTube account to enable direct video uploads from this application to your channel.
            </p>
            <a href={YOUTUBE_CONNECT_URL}>
              <Button variant="primary" leftIcon={<YoutubeConnectIcon />}>
                Connect to YouTube
              </Button>
            </a>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Link to="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPage;