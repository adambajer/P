self.addEventListener('install', (event) => {
    console.log('Service worker installed');
    self.skipWaiting(); // Activates the new service worker immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
    clients.claim(); // Allows the service worker to take control of existing clients
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'DISPLAY_NOTIFICATION') {
        const { title, body, icon, image } = event.data;
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            image: image
        });
    }
});

// Optional: Add a 'notificationclick' event listener to handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Close the notification

    // Open a new window or focus an existing one when the notification is clicked
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === self.location.origin + '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/'); // Opens your main page
            }
        })
    );
});