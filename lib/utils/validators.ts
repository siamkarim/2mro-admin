export const validateRequired = (value: string) => value.trim().length > 0;

export const validatePositiveNumber = (value: number) =>
  Number.isFinite(value) && value >= 0;

export const validatePhone = (value: string) =>
  /^\+?[0-9\s-]{7,}$/.test(value);

