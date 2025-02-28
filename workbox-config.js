module.exports = {
  globDirectory: "dist/congrejw/browser/",
  globPatterns: ["**/*.{html,js,css,ico,svg}"],
  swSrc: "dist/congrejw/browser/workbox-custom-sw.js", // Archivo fuente con la lógica de push y caché
  swDest: "dist/congrejw/browser/sw.js",
};
