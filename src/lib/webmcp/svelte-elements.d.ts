// Module augmentation adding the WebMCP Declarative API attributes
// (experimental — see https://github.com/webmachinelearning/webmcp) to
// standard HTML elements. A separate module file so TypeScript treats the
// `declare module` below as an augmentation rather than an ambient declaration.
export {};

declare module 'svelte/elements' {
  interface HTMLAttributes<T extends EventTarget> {
    /** WebMCP Declarative API (experimental): the tool name this element exposes. */
    toolname?: string | undefined | null;
    /** WebMCP Declarative API (experimental): natural-language description of the tool. */
    tooldescription?: string | undefined | null;
  }
}
