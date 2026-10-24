<script lang="ts">
  interface Props {
    query: string;
    onQuery: (query: string) => void;
  }

  let { query = $bindable(''), onQuery }: Props = $props();

  function submit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    onQuery(String(data.get('q') ?? ''));
  }
</script>

<!--
  Declarative WebMCP experiment: `toolname` / `tooldescription` turn this
  form element into a WebMCP tool agents can drive. These attributes come
  from the WebMCP explainer's Declarative API and are still unstable —
  kept isolated in this component on purpose.
-->
<form onsubmit={submit}>
  <input
    type="search"
    name="q"
    toolname="search_blog_form"
    tooldescription="Filter the blog post list by title or tag"
    placeholder="Search posts…"
    value={query}
    oninput={(e) => onQuery((e.currentTarget as HTMLInputElement).value)}
  />
  <button type="submit">Search</button>
</form>

<style lang="scss">
  form {
    display: flex;
    gap: 8px;
    margin: 0.5rem 0 1rem;
  }

  input {
    flex: 1;
    padding: 6px 10px;
    font-size: 0.9rem;
    background-color: var(--theme-surface);
    border: 1px solid var(--theme-border);
    border-radius: 6px;
    color: var(--theme-on-background);
    appearance: none;

    &:focus {
      outline: none;
      border-color: var(--theme-secondary);
    }
  }

  button {
    padding: 6px 14px;
    font-size: 0.85rem;
    background-color: transparent;
    border: 1px solid var(--theme-border);
    border-radius: 6px;
    color: var(--theme-muted);
    cursor: pointer;
    transition:
      color 0.2s,
      border-color 0.2s;

    &:hover {
      color: var(--theme-secondary);
      border-color: var(--theme-secondary);
    }
  }
</style>
