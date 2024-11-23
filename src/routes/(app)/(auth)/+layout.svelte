<script lang="ts">
</script>

<div class="wrapper">
	<div class="container">
		<slot />
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex h-full flex-col items-center justify-center;
	}

	.container {
		@apply md:p-2xl flex max-w-[30rem] flex-col gap-md rounded-md border border-neutral-700 px-md py-xl;
	}
</style>
