// Fix: Add Vite client types reference for import.meta.env
/// <reference types="vite/client" />

// Safely access import.meta.env
const env = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' 
            ? import.meta.env 
            : undefined;

export const API_BASE_URL = (env && env.VITE_API_BASE_URL) || 'http://yt.lc/api';
export const YOUTUBE_CONNECT_URL = `${API_BASE_URL}/youtube/redirect`;

// For displaying thumbnails, assuming Laravel storage link is set up
// and files in `public/thumbnails` are served from `/storage/thumbnails`
export const THUMBNAIL_BASE_URL = (env && env.VITE_APP_URL ? `${env.VITE_APP_URL}/storage` : `http://yt.lc/storage`);