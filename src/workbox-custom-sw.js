import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst } from "workbox-strategies";

// Precarga de archivos estáticos
precacheAndRoute(self.__WB_MANIFEST);

// 📌 Agregar runtimeCaching manualmente
const apiBaseUrl = process.env.API_URL; // O reemplazar dinámicamente en build

registerRoute(
  new RegExp(`^${apiBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      {
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300, // 5 minutos
        },
      },
    ],
  })
);

registerRoute(
  /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      {
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 31536000, // 1 año
        },
      },
    ],
  })
);

// 📢 Notificaciones push
self.addEventListener("push", (event) => {
  console.log("Push recibido:", event);

  let options = {
    body: "Tienes una nueva notificación",
    icon: "assets/icons/icon-192x192.png",
    badge: "assets/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: { url: "/" }, // URL que se abrirá al hacer clic en la notificación
  };

  if (event.data) {
    let data = event.data.json();
    options.body = data.body || options.body;
    options.icon = data.icon || options.icon;
    options.data.url = data.url || options.data.url;
  }

  event.waitUntil(self.registration.showNotification("Notificación", options));
});

// 🔔 Manejar clics en la notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (let client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(event.notification.data.url);
      })
  );
});
