import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { APP_CONFIG, DEFAULT_APP_CONFIG } from './core/app-config';
import { loadingInterceptor } from './core/http/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withInterceptors([loadingInterceptor])),

    // TODO(branding): your app name + primary nav. See core/app-config.ts.
    { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG },
  ],
};
