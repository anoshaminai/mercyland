export type EmailValidation =
  | { ok: true; value: string }
  | { ok: false; reason: string; suggestion?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DOMAIN_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yhoo.com': 'yahoo.com',
  'hotnail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'iclould.com': 'icloud.com',
  'icoud.com': 'icloud.com',
};

export const validateEmail = (raw: string): EmailValidation => {
  const value = raw.trim();
  if (!value) return { ok: false, reason: 'enter an email' };
  if (!EMAIL_RE.test(value)) return { ok: false, reason: "that doesn't look like an email" };

  const [local, domain] = value.split('@');
  const fix = DOMAIN_TYPOS[domain.toLowerCase()];
  if (fix) {
    return { ok: false, reason: 'check the domain', suggestion: `${local}@${fix}` };
  }
  return { ok: true, value };
};
