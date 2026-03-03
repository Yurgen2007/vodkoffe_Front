/**
 * Formatea un número con separador de miles (puntos)
 * @param num - Número a formatear
 * @param decimals - Número de decimales (por defecto 2)
 * @returns Número formateado como string
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0,00';
  }
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Formatea un número como moneda (peso colombiano)
 * @param num - Número a formatear
 * @returns String con formato de moneda
 */
export const formatCurrency = (num: number): string => {
  return `$${formatNumber(num)}`;
};

/**
 * Convierte un string con formato de moneda a número
 * @param value - String con formato de moneda (ej: "$1.234.567,89")
 * @returns Número
 */
export const parseCurrency = (value: string): number => {
  // Remover el símbolo de pesos y los puntos
  const cleaned = value.replace(/[$.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};
