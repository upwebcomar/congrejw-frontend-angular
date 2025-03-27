export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  appName: 'Congrejw (Dev)',
  allowedDomains: ['localhost:3000'],
  disallowedRoutes: ['http://localhost:3000/auth/login'],
  VAPID_PUBLIC_KEY:
    'BKgQ4t0ayzaQuvLO1LSGqa9Evyky9MkOllEaICwA4LqALXD7sYUAxRakKsJz-4gzsde1my0f4zgSZe2LCtlCx7g',
};

// no olvidar indicar las mismas variables en el environment.prod.ts y en el start.sh
