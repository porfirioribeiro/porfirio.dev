<script lang="ts">
  import { icons } from "./icons";
  type IconName = keyof typeof icons;
  interface Props {
    icon: IconName;
    size?: number;
  }

  let { icon, size = 24 }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  fill="currentColor"
  viewBox="0 0 512 512"
>
  <title>{icon}</title>
  <path d={icons[icon]} /></svg
>
