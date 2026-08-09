export function isValidCpf(value: string): boolean {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }
  let firstCheck = sum % 11;
  firstCheck = firstCheck < 2 ? 0 : 11 - firstCheck;
  if (firstCheck !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }
  let secondCheck = sum % 11;
  secondCheck = secondCheck < 2 ? 0 : 11 - secondCheck;
  return secondCheck === Number(digits[10]);
}
