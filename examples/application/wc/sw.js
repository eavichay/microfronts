const CACHE = 'app-store'

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        cache.addAll([
          '/main.bundle.js',
          '/index.html',
          '/assets',
        ])
      })
  )
})
