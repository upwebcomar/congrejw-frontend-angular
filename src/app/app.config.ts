import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Cambia a withInterceptorsFromDi
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Usa withInterceptorsFromDi para manejar interceptores de inyección de dependencias
    provideHttpClient(withInterceptorsFromDi()),
    // Utilizar importProvidersFrom para manejar el JwtModule
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: environment.allowedDomains,
          disallowedRoutes: environment.disallowedRoutes,
        },
      })
    ),
  ],
};
