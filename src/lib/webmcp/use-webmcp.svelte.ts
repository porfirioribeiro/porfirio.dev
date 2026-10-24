import { browser } from '$app/env';
import { getModelContext, registerTools, type WebMCPTool } from './model-context.js';

export type UseWebMCPOptions = {
  /** Set to false to skip registration entirely. Defaults to true. */
  enabled?: boolean;
};

export type UseWebMCPResult = {
  /** Whether the browser exposes a WebMCP API (false during SSR). */
  readonly supported: boolean;
};

/**
 * Registers the tools produced by `toolFactory` with the browser's WebMCP
 * API, re-registering whenever the factory's reactive dependencies change
 * (the `provideContext` shape replaces the whole tool set on every call, so
 * re-registration is the portable semantics).
 *
 * Cleanup runs automatically before each re-registration and on component
 * destroy. SSR-safe: a no-op on the server.
 *
 * Must be called during component initialization so the internal `$effect`
 * binds to the component's lifecycle.
 */
export function useWebMCP(
  toolFactory: () => WebMCPTool[],
  options: UseWebMCPOptions = {},
): UseWebMCPResult {
  const { enabled = true } = options;

  const supported = $state(browser && enabled && getModelContext() !== null);

  if (browser && enabled) {
    $effect(() => {
      const cleanup = registerTools(toolFactory());
      return cleanup;
    });
  }

  return {
    get supported() {
      return supported;
    },
  };
}
