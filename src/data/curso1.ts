import { videosDescriptions as videosDescriptionsEn } from './curso1-en';
import { videosDescriptions as videosDescriptionsEs } from './curso1-es';

export const getVideosDescriptions = (language: string) => {
  switch (language) {
    case 'en':
      return videosDescriptionsEn;
    case 'es':
    default:
      return videosDescriptionsEs;
  }
};

// Export for backward compatibility
export const videosDescriptions = videosDescriptionsEs;