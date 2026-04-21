/**
 * Saneia a string de telefone removendo espaços, parênteses, hifens e outros caracteres não numéricos.
 * Caso o número resultante tenha 12 dígitos (DDI+DDD+8 dígitos sem o nono dígito),
 * insere automaticamente o '9' na 5ª posição para padronizar no formato de 13 dígitos.
 * Exemplo: "557191919191" (12) → "5571991919191" (13)
 * @param phone String de telefone a ser saneada
 * @returns String contendo apenas os números, com 13 dígitos quando aplicável
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12) {
    return digits.slice(0, 4) + "9" + digits.slice(4);
  }
  return digits;
}
