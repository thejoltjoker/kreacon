<script lang="ts">
	import { Label } from 'bits-ui';
	import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';

	export let label: string;
	export let name: string;
	export let type: 'text' | 'email' | 'password' = 'text';
	export let value: string;
	export let errors: string | string[] | undefined;
	export let delayed = false;
	export let constraints = {};
	export let form: string | undefined = undefined;
	export let onInput: ((e: Event) => void) | undefined = undefined;
</script>

<Label.Root for={name} class="mb-xs flex flex-col gap-xs font-bold">
	{$_(label, { default: label })}
	<div class="relative">
		<input
			{type}
			{name}
			{form}
			aria-invalid={errors ? 'true' : undefined}
			bind:value
			ondblclick={(e) => (e.target as HTMLInputElement).select()}
			class:input-valid={!delayed && errors === undefined && value !== ''}
			class:input-invalid={errors !== undefined}
			oninput={onInput}
			{...constraints}
		/>

		{#if delayed}
			<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 animate-pulse text-zinc-500">
				<LoaderCircleIcon class="stroke-3 size-5 animate-spin stroke-zinc-500" />
			</div>
		{:else if errors !== undefined}
			<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-red-500">
				<XCircleIcon class="size-5" />
			</div>
		{:else if value}
			<div class="absolute right-xs top-1/2 size-5 -translate-y-1/2 text-green-500">
				<CheckCircle2Icon class="size-5" />
			</div>
		{/if}
	</div>
	{#if errors}
		{#if Array.isArray(errors)}
			<ul class="flex flex-col gap-xs">
				{#each errors as error}
					<li class="flex items-center gap-xs">
						<XCircleIcon class="size-5 text-red-500" />
						<p>{error}</p>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="error-message">{errors}</p>
		{/if}
	{/if}
</Label.Root>
