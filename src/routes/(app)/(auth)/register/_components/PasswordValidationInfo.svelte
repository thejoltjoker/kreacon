<script lang="ts">
	interface Props {
		errors?: string[] | undefined;
	}

	const { errors }: Props = $props();
</script>

<!-- <ul>
	<li>
		{#if errors.short}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('password_long_enough', { default: 'Password is long enough' })}
		</p>
	</li>

	<li>
		{#if errors.special}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('password_special', { default: 'Password has special character' })}
		</p>
	</li>

	<li>
		{#if errors.number}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('password_number', { default: 'Password has number' })}
		</p>
	</li>

	<li>
		{#if errors.common}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('password_uncommon', { default: 'Password is uncommon' })}
		</p>
	</li>
</ul>

<style lang="postcss">
	ul {
		@apply flex flex-col;
		& li {
			@apply inline-flex items-center gap-xs transition-all duration-500;
		}
	}
</style> -->
