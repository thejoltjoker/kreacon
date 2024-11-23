<div class="divider">
	<div class="line"></div>
	<slot />
	<div class="line"></div>
</div>

<style lang="postcss">
	.divider {
		@apply inline-flex items-center gap-sm text-center text-sm;
		& .line {
			@apply flex-1 border-b border-white opacity-50;
		}
	}
</style>
