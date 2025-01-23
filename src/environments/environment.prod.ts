// Se cargan las variables de entorno dinamicamente.
// Deben incluirse en el environment del compose.yml

// Declarar la interfaz de `window.env` en este archivo
declare global {
  interface Window {
    env?: { [key: string]: any };
  }
}

export const environment = {
  production: true,
  apiUrl: window['env']?.["apiUrl"] || 'https://default-api-url.com',
  appName: window['env']?.["appName"] || 'Default App Name',
  allowedDomains: window['env']?.["allowedDomains"]?.toString()?.split(',') || [],  // Asegura que es una cadena antes de dividir
  disallowedRoutes: window['env']?.["disallowedRoutes"]?.toString()?.split(',') || [] // Asegura que es una cadena antes de dividir
};
