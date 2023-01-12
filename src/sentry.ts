import * as Sentry from '@sentry/browser';
import { CaptureConsole as CaptureConsoleIntegration } from '@sentry/integrations';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  Sentry.init({
    ...SETNRY_ARGS,
    integrations: [
      new BrowserTracing(),
      new CaptureConsoleIntegration({
        levels: ['warn', 'error'],
      }),
    ],
  });
};
