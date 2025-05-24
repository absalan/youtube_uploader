
import { apiRequest } from './api';
import { Video, PaginatedVideosResponse } from '../types';

export const getVideos = async (page: number = 1): Promise<PaginatedVideosResponse> => {
  return apiRequest<PaginatedVideosResponse>(`/videos?page=${page}`, {
    method: 'GET',
  });
};

export const uploadVideo = async (title: string, videoFile: File): Promise<Video> => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('video_file', videoFile);

  return apiRequest<Video>('/videos', {
    method: 'POST',
    body: formData,
    isFormData: true, // Important for FormData requests
  });
};

export const initiateYoutubeUpload = async (videoId: string): Promise<Video> => {
  return apiRequest<Video>(`/videos/${videoId}/initiate-youtube-upload`, {
    method: 'POST',
  });
};
