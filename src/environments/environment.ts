export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    appName: 'Congrejw (Dev)',
    allowedDomains: ['localhost:3000'],
    disallowedRoutes: ['http://localhost:3000/auth/login']
  };
  

  // no olvidar indicar las mismas variables en el environment.prod.ts y en el init.sh