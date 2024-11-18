<script lang="ts">
	import { createLabel, melt } from '@melt-ui/svelte';
	import { Label } from 'bits-ui';
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';

	interface Props {
		label: string;
		type: 'text' | 'email' | 'password';
		placeholder: string;
		id: string;
		value: string | null | undefined;
		name: string;
		onChange: (value: string) => void;
		isValid: boolean | undefined;
		required: boolean;
		errorMessage: string | string[] | undefined;
	}

	let {
		label,
		type = 'text',
		placeholder = '',
		id = '',
		value = '',
		name = '',
		onChange = () => {},
		isValid = undefined,
		required = false,
		errorMessage = undefined,
		...restProps
	}: Props = $props();

	const handleInput = (event: Event) => {
		const inputEvent = event as InputEvent;
		const target = inputEvent.target as HTMLInputElement;
		value = target.value;
		onChange(value);
	};
</script>

<div class="container">
	<div class="flex flex-col">
		<Label.Root for={id} class="mb-xs font-bold">
			{label}
		</Label.Root>
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
				{...restProps}
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
