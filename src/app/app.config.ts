import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  HTTP_INTERCEPTORS,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './auth/auth.interceptor';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // Usa withInterceptorsFromDi para manejar interceptores de inyección de dependencias
    provideHttpClient(withInterceptorsFromDi()),
    // Registrar el AuthInterceptor usando HTTP_INTERCEPTORS
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Esto asegura que el interceptor se agregue a la lista existente
    },
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
