
import React, { useState } from 'react';
import { Video, YTUploadStatus, ApiError } from '../../types';
import { initiateYoutubeUpload } from '../../services/videoService';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { THUMBNAIL_BASE_URL } from '../../constants';

interface VideoItemProps {
  video: Video;
  onYoutubeUploadStatusChange: (videoId: string, newStatus: YTUploadStatus, updatedVideo?: Video) => void;
}

const YoutubeIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M19.615 3.185a.75.75 0 00-.521-.219H4.906a.75.75 0 00-.522.219C3.685 3.862 3 4.93 3 6.125v11.75c0 1.194.685 2.262 1.385 2.94a.751.751 0 00.522.219h14.187a.75.75 0 00.522-.219c.7-.678 1.385-1.746 1.385-2.94V6.125c0-1.194-.685-2.262-1.385-2.94zM8.25 15.875V8.125l6.75 3.875-6.75 3.875z" />
  </svg>
);


const VideoItem: React.FC<VideoItemProps> = ({ video, onYoutubeUploadStatusChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiateUpload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedVideo = await initiateYoutubeUpload(video.id);
      onYoutubeUploadStatusChange(video.id, YTUploadStatus.Uploading, updatedVideo);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to initiate YouTube upload.');
      if (apiError.message.includes("YouTube not connected")) { // Custom check
         setError("YouTube account not connected. Please connect it in settings.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: YTUploadStatus) => {
    switch (status) {
      case YTUploadStatus.NotUploaded:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 dark:text-gray-300 dark:bg-gray-600 rounded-full">Not Uploaded</span>;
      case YTUploadStatus.Uploading:
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-700/50 rounded-full animate-pulse">Uploading to YT...</span>;
      case YTUploadStatus.Uploaded:
        return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 dark:text-green-300 dark:bg-green-700/50 rounded-full">Uploaded to YT</span>;
      case YTUploadStatus.Failed:
        return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-200 dark:text-red-300 dark:bg-red-700/50 rounded-full">YT Upload Failed</span>;
      default:
        return null;
    }
  };
  
  const thumbnailUrl = video.thumbnail_path ? `${THUMBNAIL_BASE_URL}/${video.thumbnail_path.split('public/')[1]}` : `https://picsum.photos/seed/${video.id}/320/180`;


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-shadow hover:shadow-xl dark:shadow-2xl dark:hover:shadow-slate-700/50">
      <img 
        src={thumbnailUrl}
        alt={video.title} 
        className="w-full h-48 object-cover bg-gray-200 dark:bg-gray-700" // Added background for loading/error state of image
        onError={(e) => {
          e.currentTarget.src = `https://picsum.photos/seed/${video.id}/320/180`;
          e.currentTarget.classList.add('bg-gray-300', 'dark:bg-gray-600'); // Ensure fallback also has a bg
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 truncate" title={video.title}>{video.title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Uploaded: {new Date(video.uploaded_at_app).toLocaleDateString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate" title={video.original_file_name}>File: {video.original_file_name}</p>
        
        <div className="flex items-center justify-between mb-3">
          {getStatusBadge(video.yt_upload_status)}
          {video.yt_upload_status === YTUploadStatus.Uploaded && video.youtube_url && (
            <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center">
              <YoutubeIcon className="mr-1"/> View on YouTube
            </a>
          )}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {video.yt_upload_status === YTUploadStatus.NotUploaded || video.yt_upload_status === YTUploadStatus.Failed ? (
          <Button 
            onClick={handleInitiateUpload} 
            isLoading={isLoading} 
            disabled={isLoading}
            variant="primary"
            size="sm"
            className="w-full"
            leftIcon={<YoutubeIcon />}
          >
            Upload to YouTube
          </Button>
        ) : null}
         {video.yt_upload_status === YTUploadStatus.Uploading && (
           <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">Processing YouTube upload...</div>
         )}
      </div>
    </div>
  );
};

export default VideoItem;