import type {} from 'webmcp-types';

export type WebMCPTool = WebMCP.ModelContextTool;

type ProvideContextFn = (context: { tools: WebMCPTool[] }) => void;

/**
 * Detects which shape of the (still evolving) WebMCP API the browser offers:
 * - current spec: `document.modelContext.registerTool(tool, { signal })`
 * - earlier draft: `navigator.modelContext.provideContext({ tools })` which
 *   replaces the whole tool set on every call.
 */
function detectContext():
  | { kind: 'registerTool'; modelContext: WebMCP.ModelContext }
  | { kind: 'provideContext'; provideContext: ProvideContextFn }
  | null {
  if (typeof document !== 'undefined' && document.modelContext) {
    return { kind: 'registerTool', modelContext: document.modelContext };
  }
  const nav =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & { modelContext?: { provideContext?: ProvideContextFn } })
          .modelContext
      : undefined;
  if (nav?.provideContext) {
    return { kind: 'provideContext', provideContext: nav.provideContext.bind(nav) };
  }
  return null;
}

/**
 * Detects whether the browser supports WebMCP (either the current
 * `document.modelContext` spec or the earlier `navigator.modelContext` draft).
 * Returns false during SSR.
 */
export function isWebMCPSupported(): boolean {
  return detectContext() !== null;
}

/**
 * Registers a set of tools with the browser and returns a cleanup function.
 *
 * - `document.modelContext` shape: each tool gets its own AbortSignal;
 *   cleanup aborts them all.
 * - `provideContext` shape: one call with the full set; cleanup re-provides
 *   an empty set.
 * - Unsupported browsers: no-op.
 *
 * Registration rejections (e.g. Permissions-Policy denials) are logged, not
 * thrown — WebMCP must never break the page.
 */
export function registerTools(tools: WebMCPTool[]): () => void {
  const detected = detectContext();
  if (!detected) return () => {};

  if (detected.kind === 'provideContext') {
    try {
      detected.provideContext({ tools });
    } catch (error) {
      console.warn('[webmcp] failed to register tools via provideContext', error);
    }
    return () => {
      try {
        detected.provideContext({ tools: [] });
      } catch (error) {
        console.warn('[webmcp] failed to clear tools via provideContext', error);
      }
    };
  }

  const controllers = tools.map((tool) => {
    const controller = new AbortController();
    try {
      detected.modelContext
        .registerTool(tool, { signal: controller.signal })
        .catch((error: unknown) =>
          console.warn(`[webmcp] failed to register tool "${tool.name}"`, error),
        );
    } catch (error) {
      console.warn(`[webmcp] failed to register tool "${tool.name}"`, error);
    }
    return controller;
  });

  return () => {
    for (const controller of controllers) controller.abort();
  };
}
