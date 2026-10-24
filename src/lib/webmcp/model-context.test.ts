import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { getModelContext, registerTools } from './model-context.js';
import type { WebMCPTool } from './model-context.js';

const tool = (name: string): WebMCPTool => ({
  name,
  description: `Test tool ${name}`,
  inputSchema: { type: 'object', properties: {} },
  execute: () => ({ ok: true }),
});

function installFakeDocumentContext() {
  const registerTool = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal('document', { modelContext: { registerTool } });
  return { registerTool };
}

function installFakeNavigatorContext() {
  const provideContext = vi.fn();
  vi.stubGlobal('navigator', { modelContext: { provideContext } });
  return { provideContext };
}

function stubNoApi() {
  vi.stubGlobal('document', {});
  vi.stubGlobal('navigator', {});
}

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('getModelContext', () => {
  it('returns null when no API exists', () => {
    stubNoApi();
    expect(getModelContext()).toBe(null);
  });

  it('detects document.modelContext', () => {
    const { registerTool } = installFakeDocumentContext();
    const mc = getModelContext();
    expect(mc).not.toBe(null);
    mc?.registerTool(tool('a'));
    expect(registerTool).toHaveBeenCalledTimes(1);
  });

  it('falls back to navigator.modelContext provideContext', () => {
    vi.stubGlobal('document', {});
    const { provideContext } = installFakeNavigatorContext();
    const mc = getModelContext();
    expect(mc).not.toBe(null);
    mc?.registerTool(tool('a'));
    expect(provideContext).toHaveBeenCalledTimes(1);
  });
});

describe('registerTools', () => {
  it('returns a no-op cleanup and does not throw when no API exists', () => {
    stubNoApi();
    const cleanup = registerTools([tool('a')]);
    expect(() => cleanup()).not.toThrow();
  });

  it('registers each tool with its own AbortSignal', () => {
    const { registerTool } = installFakeDocumentContext();
    const cleanup = registerTools([tool('a'), tool('b')]);

    expect(registerTool).toHaveBeenCalledTimes(2);
    const [callA, callB] = registerTool.mock.calls;
    expect(callA[0].name).toBe('a');
    expect(callA[1].signal).toBeInstanceOf(AbortSignal);
    expect(callB[0].name).toBe('b');
    expect(callB[1].signal).toBeInstanceOf(AbortSignal);
    expect(callA[1].signal).not.toBe(callB[1].signal);
    expect(callA[1].signal.aborted).toBe(false);

    cleanup();
    expect(callA[1].signal.aborted).toBe(true);
    expect(callB[1].signal.aborted).toBe(true);
  });

  it('uses provideContext on the navigator shape and clears tools on cleanup', () => {
    vi.stubGlobal('document', {});
    const { provideContext } = installFakeNavigatorContext();
    const cleanup = registerTools([tool('a'), tool('b')]);

    expect(provideContext).toHaveBeenCalledTimes(1);
    expect(provideContext).toHaveBeenCalledWith({
      tools: [expect.objectContaining({ name: 'a' }), expect.objectContaining({ name: 'b' })],
    });

    cleanup();
    expect(provideContext).toHaveBeenLastCalledWith({ tools: [] });
  });

  it('logs a warning when registration is rejected', async () => {
    vi.stubGlobal('document', {
      modelContext: {
        registerTool: vi.fn().mockRejectedValue(new DOMException('denied', 'NotAllowedError')),
      },
    });
    registerTools([tool('a')]);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(console.warn).toHaveBeenCalled();
  });
});
