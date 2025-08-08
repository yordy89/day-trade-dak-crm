import API from '@/lib/axios';
import ClassesAPI from '@/lib/axios-classes';
import { errorHandler } from '@/lib/error-handler';

export interface Video {
  _id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  category: string;
  duration?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoClass {
  _id: string;
  userId: string;
  videoId: string;
  s3Key: string;
  completedAt?: string;
  progress?: number;
}

export interface VideoMetadata {
  key: string;
  signedUrl: string;
  size?: number;
  lastModified?: Date;
}

export interface CreateVideoData {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  category: string;
  duration?: number;
  isActive?: boolean;
}

class VideoService {
  async getVideos(params?: {
    category?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Video[]> {
    try {
      const response = await API.get<Video[]>('/videos', { params });
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getVideo(videoId: string): Promise<Video> {
    try {
      const response = await API.get<Video>(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load video details.',
      });
      throw new Error(apiError.message);
    }
  }

  async createVideo(data: CreateVideoData): Promise<Video> {
    try {
      const response = await API.post<Video>('/videos', data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to create video.',
      });
      throw new Error(apiError.message);
    }
  }

  async updateVideo(videoId: string, data: Partial<CreateVideoData>): Promise<Video> {
    try {
      const response = await API.put<Video>(`/videos/${videoId}`, data);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to update video.',
      });
      throw new Error(apiError.message);
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    try {
      await API.delete(`/videos/${videoId}`);
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to delete video.',
      });
      throw new Error(apiError.message);
    }
  }

  // S3 video endpoints
  async getClassVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/classVideos');
      return response.data;
    } catch (error) {
      // Check if it's an access denied error
      const isAccessError = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'status' in error.response &&
        (error.response.status === 403 || error.response.status === 401);
      
      if (isAccessError) {
        // Return empty array for access denied to avoid breaking the UI
        console.warn('Access denied for class videos - user may not have permission');
        return [];
      }
      
      const apiError = errorHandler.handle(error, {
        showToast: false, // Don't show toast for access errors
        logError: true,
        fallbackMessage: 'Failed to load class videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getMentorshipVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/mentorshipVideos');
      return response.data;
    } catch (error) {
      // Check if it's an access denied error
      const isAccessError = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'status' in error.response &&
        (error.response.status === 403 || error.response.status === 401);
      
      if (isAccessError) {
        // Return empty array for access denied to avoid breaking the UI
        console.warn('Access denied for mentorship videos - user may not have permission');
        return [];
      }
      
      const apiError = errorHandler.handle(error, {
        showToast: false, // Don't show toast for access errors
        logError: true,
        fallbackMessage: 'Failed to load mentorship videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getStockVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/stockVideos');
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load stock videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getPsicotradingVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/psicotradingVideos');
      return response.data;
    } catch (error) {
      // Check if it's an access denied error
      const isAccessError = error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'status' in error.response &&
        (error.response.status === 403 || error.response.status === 401);
      
      if (isAccessError) {
        // Return empty array for access denied to avoid breaking the UI
        console.warn('Access denied for PsicoTrading videos - user may not have permission');
        return [];
      }
      
      const apiError = errorHandler.handle(error, {
        showToast: false, // Don't show toast for access errors
        logError: true,
        fallbackMessage: 'Failed to load psicotrading videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getCurso1Videos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/cursos/curso1');
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load course videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getClassesVideos(): Promise<VideoMetadata[]> {
    try {
      // Use ClassesAPI for classes-related requests
      const response = await ClassesAPI.get<VideoMetadata[]>('/videos/classesVideos');
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load classes videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getVideoByKey(videoKey: string): Promise<VideoMetadata | null> {
    try {
      // First, get all classes videos
      const videos = await this.getClassesVideos();
      
      // Find the video by key
      const video = videos.find(v => v.key === videoKey);
      
      if (!video) {
        throw new Error(`Video not found: ${videoKey}`);
      }
      return video;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load video.',
      });
      throw new Error(apiError.message);
    }
  }

  async getLiveRecordedVideos(): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>('/videos/classVideos');
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load live recorded videos.',
      });
      throw new Error(apiError.message);
    }
  }

  async getSuperacionVideos(courseKey: string): Promise<VideoMetadata[]> {
    try {
      const response = await API.get<VideoMetadata[]>(`/videos/cursos/${courseKey}`);
      return response.data;
    } catch (error) {
      const apiError = errorHandler.handle(error, {
        showToast: true,
        logError: true,
        fallbackMessage: 'Failed to load superacion videos.',
      });
      throw new Error(apiError.message);
    }
  }

  // Video class (user progress) endpoints
  async getUserVideoClasses(): Promise<VideoClass[]> {
    try {
      const response = await API.get<VideoClass[]>('/video-classes');
      return response.data || [];
    } catch (error) {
      // Return empty array if endpoint doesn't exist yet
      // Silently handle 404 errors as the endpoint is not implemented yet
      if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
        return [];
      }
      // Log other errors as warnings
      console.warn('Video progress tracking not available');
      return [];
    }
  }

  async createVideoClass(data: {
    videoId: string;
    s3Key: string;
  }): Promise<VideoClass> {
    try {
      const response = await API.post<VideoClass>('/video-classes', data);
      return response.data;
    } catch (error) {
      // Silently handle 404 errors as the endpoint is not implemented yet
      if (error instanceof Error && 'response' in error && (error as any).response?.status === 404) {
        // Return a mock object to prevent errors
        return {
          _id: `mock-${Date.now()}`,
          userId: '',
          videoId: data.videoId,
          s3Key: data.s3Key,
        } as VideoClass;
      }
      console.warn('Video progress tracking not available');
      // Return a mock object to prevent errors
      return {
        _id: `mock-${Date.now()}`,
        userId: '',
        videoId: data.videoId,
        s3Key: data.s3Key,
      } as VideoClass;
    }
  }

  async updateVideoProgress(classId: string, progress: number): Promise<VideoClass> {
    try {
      const response = await API.patch<VideoClass>(`/video-classes/${classId}`, { progress });
      return response.data;
    } catch (error) {
      console.warn('Video progress tracking not available:', error);
      // Return mock to prevent errors
      return {
        _id: classId,
        progress,
      } as VideoClass;
    }
  }

  async completeVideo(classId: string): Promise<VideoClass> {
    try {
      const response = await API.patch<VideoClass>(`/video-classes/${classId}/complete`);
      return response.data;
    } catch (error) {
      console.warn('Video progress tracking not available:', error);
      // Return mock to prevent errors
      return {
        _id: classId,
        completedAt: new Date().toISOString(),
        progress: 100,
      } as VideoClass;
    }
  }
}

export const videoService = new VideoService();