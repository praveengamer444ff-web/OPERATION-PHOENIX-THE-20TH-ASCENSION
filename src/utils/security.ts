import DOMPurify from 'dompurify';

const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

export function sanitizeText(value: string, maxLength = 120): string {
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function isValidE164Phone(value: string): boolean {
  return PHONE_PATTERN.test(value);
}

export function isStrongPassword(value: string): boolean {
  return value.length >= 8 &&
    /[A-Z]/.test(value) &&
    /[a-z]/.test(value) &&
    /[^A-Za-z0-9]/.test(value);
}

export function getSafeProfileName(value: string): string {
  const name = sanitizeText(value, 80);
  return name || 'Commander';
}
