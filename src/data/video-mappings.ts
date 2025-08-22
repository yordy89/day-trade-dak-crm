// Video title mappings for HLS structured videos
// Maps folder names to proper titles and descriptions

interface VideoMapping {
  folderPattern: string | RegExp;
  getTitle: (folderName: string) => string;
  getDescription?: (folderName: string) => string;
  order?: number;
}

// Paz con El Dinero (curso1) mappings
export const pazConElDineroMappings: VideoMapping[] = [
  // Special case for Introduction
  { 
    folderPattern: /introduccion/i,
    getTitle: () => 'Introducción',
    order: 1
  },
  // Pattern for lessons within days (like psicotrading structure in curso1)
  { 
    folderPattern: /^(\d+)_Leccion_(\d+)_(.+)$/i,
    getTitle: (folder: string) => {
      const match = folder.match(/^(\d+)_Leccion_(\d+)_(.+)$/i);
      if (match) {
        const [, , lessonNum, type] = match;
        const typeLabel = type.toLowerCase() === 'teoria' ? 'Teoría' : 
                         type.toLowerCase().includes('practic') ? 'Práctico' : type;
        // Clean naming without day numbers for proper ordering
        return `Lección ${lessonNum} - ${typeLabel}`;
      }
      return folder;
    },
    order: 0
  },
  // Generic pattern for numbered days
  { 
    folderPattern: /^(\d+)_dia_(\d+)$/i,
    getTitle: (folder: string) => {
      const match = folder.match(/^(\d+)_dia_(\d+)$/i);
      if (match) {
        const dayNum = match[2];
        const titles: { [key: string]: string } = {
          '1': 'Introducción',
          '2': 'Aceptación y Sanación',
          '3': 'Trabajo con el Perdón',
          '4': 'Aceptación y Desapego',
          '5': 'Práctica de Aceptación',
          '6': 'La Paz Fundamental',
          '7': 'Potenciar la Paz - Autoindagación 1',
          '8': 'La Alegría de Vivir',
          '9': 'Trabajo para la Alegría',
          '10': 'Recuperar el Poder',
          '11': 'Conexión con lo Profundo',
          '12': 'Meditación de Unidad',
          '13': 'Consciencia Expandida',
          '14': 'Integración - Autoindagación 2',
          '15': 'Transformación Interior',
          '16': 'Manifestación Consciente',
          '17': 'Abundancia Natural',
          '18': 'Gratitud Profunda',
          '19': 'Consolidación',
          '20': 'Integración Final',
          '21': 'Celebración y Cierre - Autoindagación 3',
        };
        const title = titles[dayNum] || `Día ${dayNum}`;
        return `Día ${dayNum}: ${title}`;
      }
      return folder;
    },
    order: 0
  },
  // Alternative patterns that might appear
  { folderPattern: '1_día_1', getTitle: () => 'Día 1: Introducción', order: 1 },
  { folderPattern: '2_día_2', getTitle: () => 'Día 2: Aceptación y Sanación', order: 2 },
  { folderPattern: '3_día_3', getTitle: () => 'Día 3: Trabajo con el Perdón', order: 3 },
  { folderPattern: '4_día_4', getTitle: () => 'Día 4: Aceptación y Desapego', order: 4 },
  { folderPattern: '5_día_5', getTitle: () => 'Día 5: Práctica de Aceptación', order: 5 },
  { folderPattern: '6_día_6', getTitle: () => 'Día 6: La Paz Fundamental', order: 6 },
  { folderPattern: '7_día_7', getTitle: () => 'Día 7: Potenciar la Paz', order: 7 },
  { folderPattern: '8_día_8', getTitle: () => 'Día 8: La Alegría de Vivir', order: 8 },
  { folderPattern: '9_día_9', getTitle: () => 'Día 9: Trabajo para la Alegría', order: 9 },
  { folderPattern: '10_día_10', getTitle: () => 'Día 10: Recuperar el Poder', order: 10 },
  { folderPattern: '11_día_11', getTitle: () => 'Día 11: Conexión con lo Profundo', order: 11 },
  { folderPattern: '12_día_12', getTitle: () => 'Día 12: Meditación de Unidad', order: 12 },
  { folderPattern: '13_día_13', getTitle: () => 'Día 13: Consciencia Expandida', order: 13 },
  { folderPattern: '14_día_14', getTitle: () => 'Día 14: Autoindagación', order: 14 },
  { folderPattern: '15_día_15', getTitle: () => 'Día 15: Integración', order: 15 },
  { folderPattern: '16_día_16', getTitle: () => 'Día 16: Transformación', order: 16 },
  { folderPattern: '17_día_17', getTitle: () => 'Día 17: Manifestación', order: 17 },
  { folderPattern: '18_día_18', getTitle: () => 'Día 18: Abundancia', order: 18 },
  { folderPattern: '19_día_19', getTitle: () => 'Día 19: Gratitud', order: 19 },
  { folderPattern: '20_día_20', getTitle: () => 'Día 20: Consolidación', order: 20 },
  { folderPattern: '21_día_21', getTitle: () => 'Día 21: Celebración y Cierre', order: 21 },
];

// Psicotrading mappings
export const psicotradingMappings: VideoMapping[] = [
  // Special case: Introduction
  { 
    folderPattern: /^(\d+)_Introduccion$/i,
    getTitle: () => 'Introducción al PsicoTrading',
    order: 1
  },
  // Lessons with teoria
  { 
    folderPattern: /^(\d+)_Leccion_(\d+)_teoria$/i,
    getTitle: (folder: string) => {
      const match = folder.match(/^(\d+)_Leccion_(\d+)_teoria$/i);
      if (match) {
        return `Lección ${match[2]}: Teoría`;
      }
      return folder;
    },
    order: 0
  },
  // Lessons with practica/practico
  { 
    folderPattern: /^(\d+)_Leccion_(\d+)[_ ]practic[ao]$/i,
    getTitle: (folder: string) => {
      const match = folder.match(/^(\d+)_Leccion_(\d+)/i);
      if (match) {
        return `Lección ${match[2]}: Práctica`;
      }
      return folder;
    },
    order: 1
  },
  // Alternative lesson format (e.g., "13_Leccion_6 practica")
  { 
    folderPattern: /^(\d+)_leccion_(\d+) (.+)$/i,
    getTitle: (folder: string) => {
      const match = folder.match(/^(\d+)_leccion_(\d+) (.+)$/i);
      if (match) {
        const [, , lessonNum, type] = match;
        const typeLabel = type.toLowerCase() === 'teoria' ? 'Teoría' : 
                         type.toLowerCase().includes('practic') ? 'Práctica' : type;
        return `Lección ${lessonNum}: ${typeLabel}`;
      }
      return folder;
    },
    order: 0
  },
  // Jorge's Mentorías (from PsicoTrading folder)
  { 
    folderPattern: 'Mentoria Introductoria',
    getTitle: () => 'Mentoría Introductoria',
    order: -1 // Show first
  },
  { 
    folderPattern: /^Mentoria (\d+)$/,
    getTitle: (folder: string) => {
      const match = folder.match(/^Mentoria (\d+)$/);
      if (match) {
        return `Mentoría ${match[1]}`;
      }
      return folder;
    },
    order: 100 // Mentorías come after lessons
  }
];

// Master Classes mappings
export const masterClassesMappings: VideoMapping[] = [
  {
    folderPattern: /^masterclass_(\d{4})_(\d{2})_(\d{2})$/,
    getTitle: (folder: string) => {
      const match = folder.match(/^masterclass_(\d{4})_(\d{2})_(\d{2})$/);
      if (match) {
        const [, year, month, day] = match;
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return `Master Class - ${date.toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`;
      }
      return folder;
    }
  }
];

// Classes mappings
export const classesMappings: VideoMapping[] = [
  {
    folderPattern: /^modulo_(\d+)_(.+)$/,
    getTitle: (folder: string) => {
      const match = folder.match(/^modulo_(\d+)_(.+)$/);
      if (match) {
        const [, moduleNum, moduleName] = match;
        return `Módulo ${moduleNum}: ${moduleName.replace(/_/g, ' ')}`;
      }
      return folder;
    }
  }
];

// Extract lesson number from folder name for Paz con El Dinero
export function extractLessonNumber(folderName: string): number | null {
  // Special case for Introduction
  if (folderName.toLowerCase().includes('introduccion')) {
    return 1;
  }
  
  // Pattern 1: N_Leccion_M_type -> use the folder number for ordering
  const lessonMatch = folderName.match(/^(\d+)_Leccion_(\d+)_(.+)$/i);
  if (lessonMatch) {
    const [, folderNum] = lessonMatch;
    // Use the folder number directly for consistent ordering
    return parseInt(folderNum);
  }
  
  // Pattern 2: N_dia_M -> direct day number
  const dayMatch = folderName.match(/^(\d+)_dia_(\d+)$/i);
  if (dayMatch) {
    return parseInt(dayMatch[2]);
  }
  
  // Pattern 3: Just a number at the start
  const numberMatch = folderName.match(/^(\d+)_/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }
  
  return null;
}

// Helper function to get video title from folder name
export function getVideoTitle(
  folderName: string, 
  mappings: VideoMapping[],
  fallback?: string
): { title: string; order?: number; lessonNumber?: number } {
  // Remove any file extensions or HLS-specific parts
  const cleanFolder = folderName
    .replace(/\/(master|playlist)\.m3u8$/, '')
    .replace(/\/(720p|480p|360p|1080p)$/, '')
    .split('/').pop() || folderName;

  // Extract lesson number for Paz con El Dinero
  const lessonNumber = extractLessonNumber(cleanFolder);
  
  for (const mapping of mappings) {
    if (typeof mapping.folderPattern === 'string') {
      if (cleanFolder === mapping.folderPattern || cleanFolder.includes(mapping.folderPattern)) {
        return { 
          title: mapping.getTitle(cleanFolder),
          order: mapping.order,
          lessonNumber: lessonNumber || undefined
        };
      }
    } else if (mapping.folderPattern instanceof RegExp) {
      if (mapping.folderPattern.test(cleanFolder)) {
        return { 
          title: mapping.getTitle(cleanFolder),
          order: mapping.order || lessonNumber || undefined,
          lessonNumber: lessonNumber || undefined
        };
      }
    }
  }

  // If no mapping found, try to clean up the folder name
  if (fallback) {
    return { title: fallback, lessonNumber: lessonNumber || undefined };
  }

  // Default cleanup: replace underscores with spaces, remove numbers at the start
  const cleaned = cleanFolder
    .replace(/^\d+_/, '') // Remove leading number and underscore
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word

  return { title: cleaned, lessonNumber: lessonNumber || undefined };
}

// Extract unique video from HLS variants
export function extractUniqueVideoFromHLS(videos: any[]): any[] {
  // Group videos by base folder (excluding quality subfolder)
  const folderMap = new Map<string, any[]>();
  
  videos.forEach((video: any) => {
    // Parse the path to extract the base lesson folder
    // Examples:
    // hsl-daytradedak-videos/curso1/1_dia_1/720p/playlist.m3u8 -> hsl-daytradedak-videos/curso1/1_dia_1
    // hsl-daytradedak-videos/psicotrading-curso1/10_Leccion_5_teoria/master.m3u8 -> hsl-daytradedak-videos/psicotrading-curso1/10_Leccion_5_teoria
    
    let basePath = video.key;
    
    // Remove the filename at the end
    if (basePath.includes('/playlist.m3u8')) {
      basePath = basePath.replace('/playlist.m3u8', '');
    } else if (basePath.includes('/master.m3u8')) {
      basePath = basePath.replace('/master.m3u8', '');
    }
    
    // Remove quality folder if it's at the end
    basePath = basePath.replace(/\/(360p|480p|720p|1080p)$/, '');
    
    if (!folderMap.has(basePath)) {
      folderMap.set(basePath, []);
    }
    folderMap.get(basePath)!.push(video);
  });

  const uniqueVideos: any[] = [];
  
  // For each unique base folder, pick the best quality or master
  folderMap.forEach((folderVideos, basePath) => {
    // Find master.m3u8
    const masterVideo = folderVideos.find(v => v.key.endsWith('master.m3u8'));
    
    if (masterVideo && (!masterVideo.size || masterVideo.size > 100)) {
      // Use master if it exists and is either size unknown or reasonable size
      uniqueVideos.push(masterVideo);
    } else {
      // Fallback to best quality playlist
      const quality720p = folderVideos.find(v => v.key.includes('720p/playlist.m3u8'));
      const quality1080p = folderVideos.find(v => v.key.includes('1080p/playlist.m3u8'));
      const quality480p = folderVideos.find(v => v.key.includes('480p/playlist.m3u8'));
      const quality360p = folderVideos.find(v => v.key.includes('360p/playlist.m3u8'));
      
      // Prefer 720p, then 1080p, then 480p, then 360p, then master, then first available
      const selectedVideo = quality720p || quality1080p || quality480p || quality360p || masterVideo || folderVideos[0];
      if (selectedVideo) {
        uniqueVideos.push(selectedVideo);
      }
    }
  });

  return uniqueVideos;
}