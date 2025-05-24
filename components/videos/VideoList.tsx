
import React, { useState, useEffect, useCallback } from 'react';
import { getVideos } from '../../services/videoService';
import { Video, PaginatedVideosResponse, YTUploadStatus, ApiError } from '../../types';
import VideoItem from './VideoItem';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import Button from '../ui/Button';

interface VideoListProps {
  newUploadedVideo: Video | null; // To refresh list when new video is uploaded via form
}

const VideoList: React.FC<VideoListProps> = ({ newUploadedVideo }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedVideosResponse['meta'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUserVideos = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVideos(page);
      setVideos(response.data);
      setPagination(response.meta);
      setCurrentPage(response.meta.current_page);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch videos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserVideos(currentPage);
  }, [fetchUserVideos, currentPage, newUploadedVideo]);


  const handleYoutubeUploadStatusChange = (videoId: string, newStatus: YTUploadStatus, updatedVideo?: Video) => {
    setVideos(prevVideos =>
      prevVideos.map(v => (v.id === videoId ? (updatedVideo || {...v, yt_upload_status: newStatus}) : v))
    );
    // Optionally, you might want to re-fetch the specific video or the list after a delay for final confirmation from backend job.
    // For now, optimistic update is fine.
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.last_page)) {
      setCurrentPage(newPage);
    }
  };

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (videos.length === 0) {
    return <div className="text-center text-gray-600 py-10 text-lg">No videos uploaded yet.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map(video => (
          <VideoItem key={video.id} video={video} onYoutubeUploadStatusChange={handleYoutubeUploadStatusChange} />
        ))}
      </div>
      {pagination && pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-2">
          <Button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1 || loading}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-700">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <Button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === pagination.last_page || loading}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoList;
