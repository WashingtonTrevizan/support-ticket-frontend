/**
 * Formata o nome do autor para exibir apenas o primeiro e último nome
 * @param fullName - Nome completo do autor
 * @returns Nome formatado (primeiro + último nome)
 */
export const formatAuthorName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return fullName || '';
  }
  
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length <= 1) {
    return fullName;
  }
  
  if (nameParts.length === 2) {
    return fullName;
  }
  
  // Se tem mais de 2 nomes, retorna primeiro + último
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return `${firstName} ${lastName}`;
};