<script lang="ts">
  interface Props {
    reactions: { name: string; count: number; icon: string }[];
  }

  let { reactions }: Props = $props();
</script>

<div>
  {#each reactions as reaction (reaction.name)}
    <span class="reaction" title={reaction.name}>
      <span aria-hidden="true">{reaction.icon}</span>
      <span class="visually-hidden">{reaction.name}:</span>
      {reaction.count}
    </span>
  {/each}
</div>

<style lang="scss">
  div {
    padding: 8px 0;

    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;

    > .reaction {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 26px;
      padding: 0 8px;
      font-size: 12px;
      line-height: 26px;
      background-color: transparent;
      border: 1px solid #d2dff0;
      border-radius: 100px;
      color: rgb(139, 148, 158);
    }
  }
</style>
