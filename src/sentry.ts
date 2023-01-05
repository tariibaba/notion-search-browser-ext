import * as Sentry from '@sentry/browser';
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';

const ENABLED = true;

export const initSentry = () => {
  if (ENABLED)
    Sentry.init({
      dsn: SENTRY_DSN,
      release: VERSION,
      integrations: [
        new BrowserTracing(),
        new CaptureConsoleIntegration({
          levels: ['warn', 'error'],
        }),
      ],
    });
};
