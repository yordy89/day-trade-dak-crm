import API from '@/lib/axios';

export type MeetingMode = 'CONFERENCE' | 'WEBINAR' | 'INTERACTIVE';

export interface CreateMeetingOptions {
  title?: string;
  mode?: MeetingMode;
  webhookUrl?: string;
  autoStartRecording?: boolean;
}

export interface Meeting {
  roomId: string;
  token: string;
  createdAt: string;
}

export interface GenerateTokenDto {
  roomId: string;
  participantId?: string;
  participantName?: string;
  role: 'host' | 'participant';
}

class VideoSDKService {
  /**
   * Create a new meeting room
   */
  async createMeeting(options: CreateMeetingOptions = {}): Promise<Meeting> {
    try {
      const response = await API.post('/videosdk/meetings', options);
      return response.data;
    } catch (error: any) {
      console.error('Error creating meeting:', error);
      throw new Error(error.response?.data?.message || 'Failed to create meeting room');
    }
  }

  /**
   * Generate authentication token for a participant
   */
  async generateToken(dto: GenerateTokenDto): Promise<string> {
    try {
      const response = await API.post('/videosdk/tokens', dto);
      return response.data.token;
    } catch (error: any) {
      console.error('Error generating token:', error);
      throw new Error(error.response?.data?.message || 'Failed to generate authentication token');
    }
  }

  /**
   * Validate meeting room exists
   */
  async validateRoom(roomId: string): Promise<boolean> {
    try {
      const response = await API.get(`/videosdk/rooms/validate/${roomId}`);
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start recording for a meeting
   */
  async startRecording(roomId: string, webhookUrl?: string): Promise<boolean> {
    try {
      const response = await API.post('/videosdk/recordings/start', {
        roomId,
        webhookUrl,
      });
      return response.data.success;
    } catch (error: any) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  /**
   * Stop recording for a meeting
   */
  async stopRecording(roomId: string): Promise<boolean> {
    try {
      const response = await API.post('/videosdk/recordings/stop', { roomId });
      return response.data.success;
    } catch (error: any) {
      console.error('Error stopping recording:', error);
      return false;
    }
  }

  /**
   * Get recordings for a meeting
   */
  async getRecordings(roomId: string): Promise<any[]> {
    try {
      const response = await API.get(`/videosdk/recordings/${roomId}`);
      return response.data.recordings || [];
    } catch (error: any) {
      console.error('Error fetching recordings:', error);
      return [];
    }
  }

  /**
   * Create meeting based on type
   */
  async createDailyMarketAnalysis(): Promise<Meeting> {
    return this.createMeeting({
      title: `Market Analysis - ${new Date().toLocaleDateString()}`,
      mode: 'WEBINAR',
      autoStartRecording: true,
    });
  }

  async createMentorshipSession(): Promise<Meeting> {
    return this.createMeeting({
      title: `Mentorship Session - ${new Date().toLocaleDateString()}`,
      mode: 'CONFERENCE',
    });
  }

  async createQASession(): Promise<Meeting> {
    return this.createMeeting({
      title: `Q&A Session - ${new Date().toLocaleDateString()}`,
      mode: 'INTERACTIVE',
    });
  }
}

export const videoSDKService = new VideoSDKService();