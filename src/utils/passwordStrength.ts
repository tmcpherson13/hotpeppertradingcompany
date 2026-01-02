export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  requirements: PasswordRequirements;
}

const MIN_PASSWORD_LENGTH = 12;

export function checkPasswordStrength(password: string): PasswordStrength {
  const requirements: PasswordRequirements = {
    minLength: password.length >= MIN_PASSWORD_LENGTH,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metCount = Object.values(requirements).filter(Boolean).length;

  let score: 0 | 1 | 2 | 3 | 4;
  let label: PasswordStrength['label'];

  if (metCount <= 1) {
    score = 0;
    label = 'Very Weak';
  } else if (metCount === 2) {
    score = 1;
    label = 'Weak';
  } else if (metCount === 3) {
    score = 2;
    label = 'Fair';
  } else if (metCount === 4) {
    score = 3;
    label = 'Strong';
  } else {
    score = 4;
    label = 'Very Strong';
  }

  return { score, label, requirements };
}

export function isPasswordValid(password: string): boolean {
  const { requirements } = checkPasswordStrength(password);
  return Object.values(requirements).every(Boolean);
}

export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=';
  const allChars = uppercase + lowercase + numbers + special;

  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
