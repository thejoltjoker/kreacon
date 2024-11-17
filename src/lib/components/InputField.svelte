<script lang="ts">
	import { createLabel, melt } from '@melt-ui/svelte';
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';

	export let label: string;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let placeholder: string = '';
	export let id: string = '';
	export let value: string | null | undefined = '';
	export let name: string = '';
	export let onChange: (value: string) => void = () => {};
	export let isValid: boolean | undefined = undefined;
	export let required: boolean = false;
	export let errorMessage: string | string[] | undefined = undefined;

	const handleInput = (event: Event) => {
		const inputEvent = event as InputEvent;
		const target = inputEvent.target as HTMLInputElement;
		value = target.value;
		onChange(value);
	};

	const {
		elements: { root }
	} = createLabel();
</script>

<div class="container">
	<div class="flex flex-col">
		<label use:melt={$root} for={id} data-melt-part="root" class="mb-xs font-bold">
			{label}
		</label>
		<div class="relative">
			<input
				{type}
				{id}
				{placeholder}
				{value}
				{name}
				on:input={handleInput}
				class:valid={isValid === true}
				class:invalid={isValid === false}
				{required}
				{...$$restProps}
			/>

			{#if isValid === true}
				<div class="icon text-green-500"><CheckCircle2Icon class="size-5" /></div>
			{:else if isValid === false}
				<div class="icon text-red-500"><XCircleIcon class="size-5" /></div>
			{/if}
		</div>
	</div>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{:else if Array.isArray(errorMessage)}
		{#each errorMessage as message}
			<p class="error-message">{message}</p>
		{/each}
	{/if}
</div>

<style lang="postcss">
	.container {
		@apply relative flex w-full flex-col justify-center;
	}

	input {
		@apply h-form w-full rounded-sm border border-white bg-transparent px-3 py-2 focus:border-violet-500 focus:outline-none focus:ring-violet-500;
		&.valid {
			@apply border-green-500 focus:ring-green-500;
		}

		&.invalid {
			@apply border-red-500 focus:ring-red-500;
		}
	}

	.icon {
		@apply absolute right-xs top-1/2 size-5 -translate-y-1/2;
	}

	.error-message {
		@apply ml-xs mt-xxs text-sm text-amber-500;
	}
</style>
