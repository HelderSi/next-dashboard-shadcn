export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
}

export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '').substring(0, 11);
  const parts = [];

  if (numbers.length > 0) {
    parts.push(numbers.substring(0, 2)); // Area code
  }
  if (numbers.length > 2) {
    parts.push(numbers.substring(2, 3)); // Next digit after area code
  }
  if (numbers.length > 3) {
    parts.push(numbers.substring(3, 7)); // First 4 digits
  }
  if (numbers.length > 7) {
    parts.push(numbers.substring(7, 11)); // Last 4 digits
  }

  let formatted = '';
  if (parts.length > 0) {
    formatted = `(${parts[0]}`;
    if (parts.length > 1) {
      formatted += `) ${parts[1]}`;
      if (parts.length > 2) {
        formatted += ` ${parts[2]}`;
        if (parts.length > 3) {
          formatted += `-${parts[3]}`;
        }
      }
    }
  }
  return formatted;
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

