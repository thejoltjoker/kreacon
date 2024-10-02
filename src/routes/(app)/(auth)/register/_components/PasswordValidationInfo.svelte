<script lang="ts">
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	export let validationErrorPaths: string[] = [];
</script>

<ul>
	<li>
		{#if validationErrorPaths.includes('too_small')}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('validation.password_long_enough', { default: 'Password is long enough' })}
		</p>
	</li>

	<li>
		{#if validationErrorPaths.includes('special')}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('validation.password_special', { default: 'Password has special character' })}
		</p>
	</li>

	<li>
		{#if validationErrorPaths.includes('number')}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('validation.password_number', { default: 'Password has number' })}
		</p>
	</li>

	<li>
		{#if validationErrorPaths.includes('common')}
			<XCircleIcon class="size-5  text-red-500" />
		{:else}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{/if}
		<p>
			{$_('validation.password_uncommon', { default: 'Password is uncommon' })}
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
</style>
