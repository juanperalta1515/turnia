import { esES } from './locales/es-ES';
import { esAR } from './locales/es-AR';

export const locales = {
  'es-ES': esES,
  'es-AR': esAR,
};

export type LocaleKey = keyof typeof locales;

/**
 * A basic translation helper.
 * Resolves paths like 'booking.appointment' to localized values.
 */
export function t(locale: LocaleKey, path: string, variables: Record<string, string> = {}): string {
  const dict = locales[locale] || locales['es-ES'];
  
  const keys = path.split('.');
  let current: any = dict;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Fallback to path name
    }
  }
  
  if (typeof current !== 'string') {
    return path;
  }
  
  // Replace variables
  let result = current;
  for (const [key, val] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), val);
  }
  
  return result;
}
