/**
 * Saneia a string de telefone removendo espaços, parênteses, hifens e outros caracteres não numéricos.
 * @param phone String de telefone a ser saneada
 * @returns String contendo apenas os números
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}
