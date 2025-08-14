// Service Worker for Progressive Web App functionality
const CACHE_NAME = 'marci-metzger-homes-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Static resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/script.js',
    '/assets/images/marci.png',
    '/assets/images/showcase_1.jpg',
    '/assets/images/showcase_2.jpg',
    '/assets/images/showcase_3.jpg',
    '/assets/images/showcase_4.jpg',
    '/assets/images/showcase_5.jpg',
    '/assets/images/showcase_6.jpg',
    '/assets/images/showcase_7.jpg',
    '/assets/images/frontyard.png',
    '/assets/images/kitchen.png',
    '/assets/images/backyard.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap',
    'https://cdn.tailwindcss.com'
];

// Dynamic cache strategies
const CACHE_STRATEGIES = {
    images: 'cache-first',
    api: 'network-first',
    static: 'cache-first'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Installation complete');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Installation failed', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached resources with fallback strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;
    
    event.respondWith(
        handleFetch(request)
    );
});

async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy based on resource type
        if (isImageRequest(request)) {
            return await cacheFirstStrategy(request, DYNAMIC_CACHE);
        }
        
        if (isStaticAsset(request)) {
            return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        if (isAPIRequest(request)) {
            return await networkFirstStrategy(request, DYNAMIC_CACHE);
        }
        
        // Default: network first with cache fallback
        return await networkFirstStrategy(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('Service Worker: Fetch failed', error);
        
        // Return offline fallback if available
        return getOfflineFallback(request);
    }
}

// Cache-first strategy (good for static assets)
async function cacheFirstStrategy(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request, cacheName);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network-first strategy (good for API calls)
async function networkFirstStrategy(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background cache update
async function updateCacheInBackground(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
    } catch (error) {
        // Background update failed, ignore
    }
}

// Helper functions
function isImageRequest(request) {
    return request.destination === 'image' || 
           request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

function isStaticAsset(request) {
    return request.url.match(/\.(css|js|woff|woff2|ttf|eot)$/i) ||
           request.url.includes('fonts.googleapis.com') ||
           request.url.includes('cdnjs.cloudflare.com');
}

function isAPIRequest(request) {
    return request.url.includes('/api/') ||
           request.url.includes('api.');
}

async function getOfflineFallback(request) {
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        const offlinePage = await caches.match('/index.html');
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // Return generic offline response
    return new Response('Offline - Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(processBackgroundSync());
    }
});

async function processBackgroundSync() {
    // Process queued form submissions when online
    console.log('Service Worker: Processing background sync');
    
    // In a real app, you'd retrieve queued data from IndexedDB
    // and send it to your server
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    
    const options = {
        body: data.body,
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        data: data.url,
        actions: [
            {
                action: 'view',
                title: 'View Details'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data)
        );
    }
});

// Periodic background sync (for future enhancement)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'property-updates') {
        event.waitUntil(checkForPropertyUpdates());
    }
});

async function checkForPropertyUpdates() {
    // Check for new property listings
    console.log('Service Worker: Checking for property updates');
}

// Message handling from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Unhandled promise rejection', event.reason);
});
