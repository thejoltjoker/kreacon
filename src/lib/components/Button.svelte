<script lang="ts">
	export let type: 'button' | 'submit' = 'button';
	export let disabled: boolean = false;
	export let onClick: (event: MouseEvent) => void = () => {};
	export let variant: 'rose' | 'transparent' = 'transparent';

	const variants = {
		rose: 'bg-rose-500 text-white border-rose-600 hover:bg-rose-900/20 transition hover:border hover:border-rose-500',
		transparent:
			'bg-transparent dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black'
	};
</script>

<button {type} {disabled} on:click={onClick} class={`${variants[variant]}`}>
	<slot />
</button>

<style lang="postcss">
	button {
		@apply relative inline-flex h-button items-center justify-center gap-xs rounded-full border px-md py-xs font-bold transition-colors;
	}
</style>
