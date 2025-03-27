importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

const API_URL = "__API_URL__";

if (workbox) {
  console.log("Workbox cargado 🎉");

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // 📌 Cacheo dinámico para la API con stale-while-revalidate
  workbox.routing.registerRoute(
    ({ url }) => url.origin === API_URL,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 día
        }),
      ],
    })
  );

  // 📢 Notificaciones push
  self.addEventListener("push", (event) => {
    console.log("📢 Push recibido:", event);
    if (!event.data) {
      console.warn("❌ No hay datos en el evento push.");
      return;
    }

    let data;
    try {
      data = event.data.json();
    } catch (error) {
      console.error("❌ Error al parsear los datos:", error);
      return;
    }

    console.log("📩 Datos del push:", data);

    const options = {
      body: data.body || "Tienes un nuevo mensaje",
      icon: data.icon || "/assets/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      data: { url: data.url ?? "/" },
    };

    console.log("🔔 Mostrando notificación...");
    event.waitUntil(
      self.registration.showNotification(data.title || "Notificación", options)
    );
  });

  // 🔔 Manejar clic en la notificación
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url ?? "/";
    event.waitUntil(self.clients.openWindow(targetUrl));
  });
} else {
  console.log("Workbox no pudo cargarse 😢");
}
