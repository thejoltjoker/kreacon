<script lang="ts">
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';

	export let passwordValidationState = {
		isLongEnough: false,
		hasSpecialChar: false,
		hasNumber: false,
		isUncommonPassword: false
	};
</script>

<ul>
	<li>
		{#if passwordValidationState.isLongEnough}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{:else}
			<XCircleIcon class="size-5  text-red-500" />
		{/if}
		<p>Password is long enough</p>
	</li>

	<li>
		{#if passwordValidationState.hasSpecialChar}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{:else}
			<XCircleIcon class="size-5  text-red-500" />
		{/if}
		<p>Password has special character</p>
	</li>

	<li>
		{#if passwordValidationState.hasNumber}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{:else}
			<XCircleIcon class="size-5  text-red-500" />
		{/if}
		<p>Password has number</p>
	</li>

	<li>
		{#if passwordValidationState.isUncommonPassword}
			<CheckCircle2Icon class="size-5  text-green-500" />
		{:else}
			<XCircleIcon class="size-5  text-red-500" />
		{/if}
		<p>Password is uncommon</p>
	</li>
</ul>

<style lang="postcss">
	ul {
		& li {
			@apply inline-flex items-center gap-xs transition-all duration-500;
		}
	}
</style>
