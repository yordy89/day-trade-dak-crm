export const formatVideoTitle = (key: string): string => {
  // Handle new format: class-daily/07:22:2025/master.m3u8
  // or class-daily/07:24:2025/720p/playlist.m3u8
  
  // Extract the date portion from the path
  const dateRegex = /(?<month>\d{2}):(?<day>\d{2}):(?<year>\d{4})/;
  const dateMatch = dateRegex.exec(key);
  
  if (dateMatch?.groups) {
    const { month, day, year } = dateMatch.groups;
    
    // Map months to Spanish names
    const months: Record<string, string> = {
      '01': 'Enero',
      '02': 'Febrero',
      '03': 'Marzo',
      '04': 'Abril',
      '05': 'Mayo',
      '06': 'Junio',
      '07': 'Julio',
      '08': 'Agosto',
      '09': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre',
    };
    
    // Return formatted title
    return months[month] && day && year 
      ? `Sesión del ${parseInt(day)} de ${months[month]} ${year}`
      : `Sesión ${month}/${day}/${year}`;
  }
  
  // Fallback for old format or other formats
  const filename = key.replace('class-videos/', '').replace('class-daily/', '').replace('.mp4', '').replace('/master.m3u8', '');
  return filename;
};

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  
  // Format as Spanish date: DD/MM/YYYY
  return dateObj.toLocaleDateString('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  
  // Format as Spanish date and time
  return dateObj.toLocaleDateString('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }
  
  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Mañana';
  } else if (diffDays === -1) {
    return 'Ayer';
  }
  if (diffDays > 0 && diffDays < 7) {
    return `En ${diffDays} días`;
  }
  if (diffDays < 0 && diffDays > -7) {
    return `Hace ${Math.abs(diffDays)} días`;
  }
  return formatDate(dateObj);
}
