<script lang="ts">
  import { icons } from "./icons";
  type IconName = keyof typeof icons;
  interface Props {
    icon: IconName;
    size?: number;
    /** Accessible name. Omit for icons that are decorative or labelled elsewhere. */
    label?: string;
  }

  let { icon, size = 24, label }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  fill="currentColor"
  viewBox="0 0 512 512"
  role={label ? 'img' : undefined}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
>
  {#if label}
    <title>{label}</title>
  {/if}
  <path d={icons[icon]} /></svg
>
