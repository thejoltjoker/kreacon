<script lang="ts">
	import { Label } from 'bits-ui';
	import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from 'lucide-svelte';
	import { t } from '$lib/i18n';
	interface Props extends Label.RootProps {
		label: string;
		name: string;
		type?: 'text' | 'email' | 'password';
		value: string;
		errors?: string | string[];
		delayed?: boolean;
		constraints?: Record<string, unknown>;
		form?: string;
		onInput?: (e: Event) => void;
		required?: boolean;
	}
	let {
		label,
		name,
		type = 'text',
		value = $bindable(),
		errors,
		delayed = false,
		constraints = {},
		form = undefined,
		onInput = $bindable(),
		required = false
	}: Props = $props();
</script>

<Label.Root for={name} class="gap-xs flex flex-col font-bold">
	{$t(label)}
	<div class="relative">
		<input
			{type}
			{name}
			{form}
			{required}
			aria-invalid={errors ? 'true' : undefined}
			bind:value
			ondblclick={(e) => (e.target as HTMLInputElement).select()}
			class:input-valid={!delayed && errors === undefined && value !== ''}
			class:input-invalid={errors !== undefined}
			oninput={onInput}
			{...constraints}
		/>

		{#if delayed}
			<div
				class="right-xs text-muted-foreground absolute top-1/2 size-5 -translate-y-1/2 animate-pulse"
			>
				<LoaderCircleIcon class="stroke-muted-foreground size-5 animate-spin stroke-3" />
			</div>
		{:else if errors !== undefined}
			<div class="right-xs absolute top-1/2 size-5 -translate-y-1/2 text-red-500">
				<XCircleIcon class="size-5" />
			</div>
		{:else if value}
			<div class="right-xs absolute top-1/2 size-5 -translate-y-1/2 text-green-500">
				<CheckCircle2Icon class="size-5" />
			</div>
		{/if}
	</div>
	{#if errors}
		{#if Array.isArray(errors)}
			<ul class="gap-xs flex flex-col">
				{#each errors as error, i (i)}
					<li class="gap-xs flex items-center">
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
