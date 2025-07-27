// Feature flags configuration
export const features = {
  // Meeting features
  meetings: {
    enabled: true, // Set to true to show meeting features
    useVideoSDK: false, // Legacy VideoSDK implementation
    useZoom: true, // New Zoom implementation
  },
  
  // Other features can be added here
} as const;

export type Features = typeof features;