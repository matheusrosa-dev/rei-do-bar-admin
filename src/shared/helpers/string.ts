export function formatZipCode(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/(\d{5})(\d{3})/, "$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return value;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: string) {
  const dateString = new Date(date).toLocaleDateString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return dateString.split(", ")[1];
}
