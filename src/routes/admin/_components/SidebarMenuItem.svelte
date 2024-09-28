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
		@apply flex w-full rounded-sm px-xs transition hover:bg-zinc-900;
		& a {
			@apply inline-flex grow items-center gap-sm py-xs font-bold;
		}
	}

	.count {
		@apply ml-auto rounded-full bg-zinc-700 px-3 py-1 text-center text-sm;
	}
</style>
