const apiBaseUrl = process.env.API_URL || 'https://default-api-url.com';

module.exports = {
  globDirectory: 'dist/congrejw/browser/',
  globPatterns: ['**/*.{html,js,css,ico,svg}'],
  swDest: 'dist/congrejw/browser/sw.js',
  runtimeCaching: [
    {
      // Crear patrón dinámico basado en la variable de entorno
      urlPattern: new RegExp(`^${apiBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300, // 5 minutos
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 31536000, // 1 año
        },
      },
    },
  ],
};
