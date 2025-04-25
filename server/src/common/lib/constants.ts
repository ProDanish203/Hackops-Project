export const EMAIL_TYPES = {
  VERIFY: 'verify',
  RESET: 'reset',
} as const;

export type EmailTypes = (typeof EMAIL_TYPES)[keyof typeof EMAIL_TYPES];
