import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const axiosAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_CLIENT}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    const token = cookies.get("token");

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de respuesta para manejar errores
axiosAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar diferentes tipos de errores
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      const message = error.response.data?.message || "Error del servidor";

      // Log del error para debugging
      console.error(`Error HTTP ${status}:`, message);

      switch (status) {
        case 401:
          // No autorizado - redirigir al login
          cookies.remove("token");
          cookies.remove("permissions");
          window.location.href = "/login";
          break;
        case 403:
          // Prohibido - Sin permisos
          console.warn("Sin permisos para esta acción:", message);
          break;
        case 404:
          // No encontrado
          console.warn("Recurso no encontrado:", message);
          break;
        case 500:
          // Error interno del servidor
          console.error("Error del servidor (500):", message);
          break;
        default:
        // Mostrar mensaje de error del servidor si está disponible
        const errorMessage = error.response.data?.message || error.response.data?.error || `Error ${status}`;
        console.error(`Error HTTP ${status}:`, errorMessage);
      }
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } else {
      // Error al configurar la solicitud
      console.error("Error al procesar la solicitud:", error.message);
    }

    return Promise.reject(error);
  }
);

export const axiosInstance = axiosAPI;
export default axiosAPI;
