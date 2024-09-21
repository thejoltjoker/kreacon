<script lang="ts">
	export let href: string = '';
</script>

<a {href}>
	<slot />
</a>

<style lang="postcss">
	a {
		@apply underline decoration-rose-500 decoration-2 hover:bg-rose-500 hover:opacity-100;
	}
</style>
