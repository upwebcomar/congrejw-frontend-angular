module.exports = {
	globDirectory: 'dist/congrejw/browser/',
	globPatterns: [
	  '**/*.{html,js,css,ico,svg}'
	],
	swDest: 'dist/congrejw/browser/sw.js',
	runtimeCaching: [
	  {
		urlPattern: /^https:\/\/apicongrejw\.upweb\.com\.ar\/.*/,
		handler: 'NetworkFirst',
		options: {
		  cacheName: 'api-cache',
		  expiration: {
			maxEntries: 50,
			maxAgeSeconds: 300
		  }
		}
	  },
	  {
		urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/,
		handler: 'CacheFirst',
		options: {
		  cacheName: 'google-fonts-cache',
		  expiration: {
			maxEntries: 20,
			maxAgeSeconds: 31536000
		  }
		}
	  }
	]
  };
  