
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  is_youtube_connected: boolean;
  youtube_channel_name?: string | null;
  created_at: string;
  updated_at: string;
}

export enum YTUploadStatus {
  NotUploaded = 'NOT_UPLOADED',
  Uploading = 'UPLOADING',
  Uploaded = 'UPLOADED',
  Failed = 'FAILED',
}

export interface Video {
  id: string; // uuid
  user_id: number;
  title: string;
  original_file_name: string;
  file_path: string; // Server-side path
  thumbnail_path?: string | null; // Publicly accessible path for thumbnail
  yt_upload_status: YTUploadStatus;
  youtube_video_id?: string | null;
  youtube_url?: string | null;
  uploaded_at_app: string; // Timestamp
  created_at: string;
  updated_at: string;
}

export interface PaginatedVideosResponse {
  data: Video[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
