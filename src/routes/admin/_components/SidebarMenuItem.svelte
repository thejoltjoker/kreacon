<script lang="ts">
	import { InfoIcon, type Icon } from 'lucide-svelte';
	import { type ComponentType } from 'svelte';
	export let label: string;
	export let href: string;
	export let icon: ComponentType<Icon> = InfoIcon;
	export let active: boolean = false;
	export let count: number | undefined = undefined;
</script>

<li class:active>
	<a {href}>
		<svelte:component this={icon} class="w-full" />
		{label}
		{#if count}
			<div class="count">{count}</div>
		{/if}
	</a>
</li>

<style lang="postcss">
	li {
		@apply hover:bg-muted-background flex w-full rounded-sm px-xs transition;
		& a {
			@apply inline-flex grow items-center gap-sm py-xs font-bold;
		}
	}

	.count {
		@apply bg-muted-background ml-auto rounded-full px-3 py-1 text-center text-sm;
	}
</style>
