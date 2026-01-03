// Backend Sentry initialization
// Re-export Sentry from @sentry/sveltekit which is initialized in instrumentation.server.ts
// This ensures we use the same Sentry instance that's properly configured for SvelteKit
import * as Sentry from '@sentry/sveltekit';

export { Sentry };
