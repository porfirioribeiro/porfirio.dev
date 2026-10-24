import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { isWebMCPSupported, registerTools } from './model-context.js';
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

describe('isWebMCPSupported', () => {
  it('returns false when no API exists', () => {
    stubNoApi();
    expect(isWebMCPSupported()).toBe(false);
  });

  it('returns true when document.modelContext exists', () => {
    installFakeDocumentContext();
    expect(isWebMCPSupported()).toBe(true);
  });

  it('returns true when navigator.modelContext.provideContext exists', () => {
    vi.stubGlobal('document', {});
    installFakeNavigatorContext();
    expect(isWebMCPSupported()).toBe(true);
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

  it('logs a warning and does not throw when a sync exception occurs during registration', () => {
    installFakeDocumentContext();
    const registerTool = vi.fn(() => {
      throw new DOMException('denied', 'InvalidStateError');
    });
    vi.stubGlobal('document', { modelContext: { registerTool } });

    expect(() => registerTools([tool('a')])).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  it('logs a warning and does not throw when provideContext fails', () => {
    vi.stubGlobal('document', {});
    const provideContext = vi.fn(() => {
      throw new DOMException('denied', 'NotAllowedError');
    });
    vi.stubGlobal('navigator', { modelContext: { provideContext } });

    expect(() => registerTools([tool('a')])).not.toThrow();
    expect(console.warn).toHaveBeenCalled();

    vi.mocked(provideContext).mockImplementation(() => {});
    const cleanup = registerTools([tool('a')]);
    provideContext.mockImplementation(() => {
      throw new DOMException('denied', 'NotAllowedError');
    });
    expect(() => cleanup()).not.toThrow();
  });
});
