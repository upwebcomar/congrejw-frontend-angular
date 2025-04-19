// src/custom.d.ts
export {};

declare global {
  interface Window {
    env?: {
      apiUrl?: string;
      // otras variables que quieras agregar
    };
  }
}
