// TreeShop Service Worker for PWA
const CACHE_NAME = 'treeshop-v1.1'
const STATIC_CACHE = 'treeshop-static-v1.1'
const DYNAMIC_CACHE = 'treeshop-dynamic-v1.1'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/logo.png',
  '/icon-dark-32x32.png',
  '/apple-icon.png',
  '/manifest.json',
]

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => {
      return self.skipWaiting() // Activate immediately
    })
  )
})

// Fetch event - network first, fallback to cache (for dynamic content)
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return

  // API requests - network first, cache fallback
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          return caches.match(request)
        })
    )
    return
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response
        }

        const responseClone = response.clone()
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone)
        })

        return response
      }).catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/dashboard')
        }
      })
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim() // Take control immediately
    })
  )
})

// Background sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

async function syncData() {
  // Placeholder for future background sync
  console.log('Background sync triggered')
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from TreeShop',
    icon: '/icon-dark-32x32.png',
    badge: '/icon-dark-32x32.png',
    vibrate: [200, 100, 200],
  }

  event.waitUntil(
    self.registration.showNotification('TreeShop', options)
  )
})
