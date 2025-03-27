module.exports = {
  globDirectory: "dist/congrejw/browser/",
  globPatterns: ["**/*.{html,js,css,ico,svg}"],
  swSrc: "workbox/sw-template.js", // Workbox usará este archivo como base
  swDest: "dist/congrejw/browser/sw.js", // Workbox generará este archivo final
};
