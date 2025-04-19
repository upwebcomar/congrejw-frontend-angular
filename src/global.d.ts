// src/global.d.ts
export {};

declare global {
  interface Window {
    env?: { [key: string]: any };
  }
}
