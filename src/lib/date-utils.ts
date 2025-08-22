/**
 * Utility functions for handling dates consistently across the application
 * Prevents timezone conversion issues when displaying dates from the database
 */

/**
 * Formats a UTC date string to display the correct date regardless of user's timezone
 * This prevents issues where a date like "2025-08-23T00:14:00.000+00:00" (Saturday 23rd)
 * would display as Friday 22nd in timezones behind UTC
 * 
 * @param dateString - The UTC date string from the database
 * @param locale - The locale to use for formatting (e.g., 'es-ES', 'en-US')
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string showing the correct UTC date
 */
export function formatUTCDate(
  dateString: string | Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  
  // Create a new date using UTC values to avoid timezone conversion
  const displayDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  
  return displayDate.toLocaleDateString(locale, options);
}

/**
 * Formats a UTC date string with time
 * 
 * @param dateString - The UTC date string from the database
 * @param locale - The locale to use for formatting
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date and time string
 */
export function formatUTCDateTime(
  dateString: string | Date,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);
  
  // Create a new date using UTC values
  const displayDate = new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  
  return displayDate.toLocaleString(locale, options);
}

/**
 * Gets a Date object that represents the UTC date in local time
 * Useful for date-fns or other libraries that need a Date object
 * 
 * @param dateString - The UTC date string from the database
 * @returns Date object with UTC values displayed as local
 */
export function getUTCDateAsLocal(dateString: string | Date): Date {
  const date = new Date(dateString);
  
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
}

/**
 * Checks if a UTC date is in the past
 * 
 * @param dateString - The UTC date string from the database
 * @returns true if the date is in the past
 */
export function isUTCDateInPast(dateString: string | Date): boolean {
  const date = new Date(dateString);
  const now = new Date();
  
  // Compare using UTC values
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  
  const utcNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  );
  
  return utcDate < utcNow;
}

/**
 * Format date for display in event cards and lists
 * Shows the date in a user-friendly format
 * 
 * @param dateString - The UTC date string from the database
 * @param language - The language code ('es' or 'en')
 * @returns Formatted date string
 */
export function formatEventDate(dateString: string | Date, language: string = 'en'): string {
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  
  return formatUTCDate(dateString, locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date and time for event details
 * 
 * @param dateString - The UTC date string from the database
 * @param language - The language code ('es' or 'en')
 * @returns Formatted date and time string
 */
export function formatEventDateTime(dateString: string | Date, language: string = 'en'): string {
  const locale = language === 'es' ? 'es-ES' : 'en-US';
  
  return formatUTCDateTime(dateString, locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}