<script lang="ts">
  interface Props {
    reactions: { name: string; count: number; icon: string }[];
  }

  let { reactions }: Props = $props();
</script>

<div>
  {#each reactions as reaction}
    <button title={reaction.name}>{reaction.icon}&nbsp;{reaction.count}</button>
  {/each}
</div>

<style lang="scss">
  div {
    padding: 8px 0;

    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;

    > button {
      height: 26px;
      padding: 0 8px;
      font-size: 12px;
      line-height: 26px;
      background-color: transparent;
      border: 1px solid #d2dff0;
      border-radius: 100px;

      appearance: none;

      color: rgb(139, 148, 158);
    }
  }
</style>
