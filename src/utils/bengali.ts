const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBn(num: number | string): string {
  return String(num).replace(/\d/g, (digit) => BN_DIGITS[parseInt(digit, 10)]);
}

export function generateUid(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36).substring(5);
}
