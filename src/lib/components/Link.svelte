<script lang="ts">
	export let href: string = '';
</script>

<a {href}>
	<slot />
</a>

<style lang="postcss">
	a {
		@apply underline decoration-rose-500 decoration-2 hover:text-rose-500 hover:no-underline hover:opacity-100;
	}
</style>
