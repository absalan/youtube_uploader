
import React, { useState, useRef } from 'react';
import { uploadVideo } from '../../services/videoService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { ApiError, Video } from '../../types';

interface VideoUploadFormProps {
  onUploadSuccess: (video: Video) => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccessMessage(null);

    try {
      const newVideo = await uploadVideo(title, videoFile);
      setSuccessMessage(`Video "${newVideo.title}" uploaded successfully!`);
      onUploadSuccess(newVideo);
      setTitle('');
      setVideoFile(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Video upload failed.');
      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Upload New Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && Object.keys(fieldErrors).length === 0 && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}
        
        <Input
          label="Video Title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={fieldErrors.title?.[0]}
          placeholder="Enter video title"
        />
        <div>
          <label htmlFor="video_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video File
          </label>
          <input
            id="video_file"
            name="video_file"
            type="file"
            accept="video/*"
            required
            ref={fileInputRef}
            onChange={handleFileChange}
            className={`mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-700 file:text-primary-700 dark:file:text-primary-200 hover:file:bg-primary-100 dark:hover:file:bg-primary-600 ${fieldErrors.video_file ? 'border-red-500 dark:border-red-400 border rounded-md p-1' : 'dark:border-gray-600'}`}
          />
          {fieldErrors.video_file && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.video_file[0]}</p>}
        </div>

        <Button type="submit" isLoading={isLoading} disabled={isLoading || !videoFile}>
          Upload Video
        </Button>
      </form>
    </div>
  );
};

export default VideoUploadForm;