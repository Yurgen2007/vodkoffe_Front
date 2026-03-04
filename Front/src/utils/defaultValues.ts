/**
 * Utilitarios para valores por defecto
 * Elimina código duplicado en formularios
 */

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Obtiene la fecha actual con hora en formato ISO
 */
export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

/**
 * Valor por defecto para estados booleanos
 */
export const DEFAULT_ESTADO = true;

/**
 * Valor por defecto para cantidades
 */
export const DEFAULT_CANTIDAD = 1;

/**
 * Valor por defecto para costos
 */
export const DEFAULT_COSTO = 0;

/**
 * Valores por defecto para formularios comunes
 */
export const commonDefaultValues = {
  estado: DEFAULT_ESTADO,
  cantidad: DEFAULT_CANTIDAD,
  cantidadUnidades: DEFAULT_CANTIDAD,
  costoUnitario: DEFAULT_COSTO,
  fechaProduccion: getCurrentDate(),
};
