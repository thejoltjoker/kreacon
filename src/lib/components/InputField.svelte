<script lang="ts">
	import { createLabel, melt } from '@melt-ui/svelte';
	import { CheckCircle2Icon, XCircleIcon } from 'lucide-svelte';
	export let label: string;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let placeholder: string = '';
	export let id: string = '';
	export let value: string = '';
	export let name: string = '';
	export let onChange: (value: string) => void = () => {};
	export let isValid: boolean | undefined = undefined;

	const handleInput = (e) => {
		value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
		onChange(value);
	};
	const {
		elements: { root }
	} = createLabel();
</script>

<div class="container">
	<label use:melt={$root} for={id} data-melt-part="root">
		<span class="hidden">{label}</span>
	</label>
	<input
		{type}
		{id}
		{placeholder}
		{value}
		{name}
		on:input={handleInput}
		class={`input ${isValid === true ? 'valid' : isValid === false ? 'invalid' : ''}`}
	/>
	{#if isValid === true}
		<CheckCircle2Icon class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-green-500" />
	{:else if isValid === false}
		<XCircleIcon class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500" />
	{/if}
</div>

<style lang="postcss">
	.container {
		@apply relative flex flex-col items-start justify-center;
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
</style>
