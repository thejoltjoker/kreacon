<script lang="ts">
	import type { PasswordValidation } from '$lib/validation/password/passwordValidation';
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';

	export let passwordValidationState: PasswordValidation = {
		isLongEnough: false,
		hasSpecialCharacter: false,
		hasNumber: false,
		isNotCommonPassword: false,
		isNotUsernameOrEmail: false
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
		{#if passwordValidationState.hasSpecialCharacter}
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
		{#if passwordValidationState.isNotCommonPassword}
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
