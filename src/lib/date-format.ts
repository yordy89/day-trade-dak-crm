export const formatVideoTitle = (key: string): string => {
  // Remove prefix & file extension
  const filename = key.replace('class-videos/', '').replace('.mp4', '');

  // Extract parts (expected format: MM:DD:YYYY)
  const [month, day, year] = filename.split(':');

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

  // Validate format & return formatted title
  return months[month] && day && year ? `${parseInt(day)} ${months[month]} ${year}` : filename;
};
