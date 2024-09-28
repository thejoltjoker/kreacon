<script lang="ts">
</script>

<div class="wrapper">
	<div class="container">
		<slot />
	</div>
</div>

<style lang="postcss">
	.wrapper {
		@apply flex h-screen flex-col items-center justify-center;
	}

	.container {
		@apply flex w-[30rem] flex-col gap-md rounded-md border border-neutral-700 p-xxl;
	}
</style>
