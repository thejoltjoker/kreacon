<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { LockIcon, PencilIcon, PlusIcon, UnlockIcon } from 'lucide-svelte';

	interface Category {
		name: string;
		rules: { value: string; isLocked: boolean }[];
	}

	let { value = $bindable(), title }: { value: string; title: string } = $props();

	let rules = $state<{ value: string; isLocked: boolean }[]>([]);
</script>

<div class="flex w-full flex-col gap-sm rounded-form border border-divider p-xl">
	<h4>Category: {title}</h4>
	<!-- TODO Replace with select/combobox -->
	<DumbInput name="categories" bind:value class="w-full" />

	<div class="mt-sm flex items-center justify-between">
		<h5>Rules</h5>
		<Button
			icon={PlusIcon}
			variant="neutral"
			class="rounded-none border-b border-transparent text-muted-foreground-alt hover:border-white hover:text-white"
			onclick={() => rules.push({ value: '', isLocked: false })}
		>
			Add Rule
		</Button>
	</div>
	<ul class="flex flex-col gap-sm">
		{#each rules as _, index}
			<li class="flex items-center gap-sm">
				<DumbInput
					onkeydowncapture={(e) => {
						if (e.key === 'Enter') {
							rules[index].isLocked = !rules[index].isLocked;
						}
					}}
					bind:value={rules[index].value}
					disabled={rules[index].isLocked}
					icon={rules[index].isLocked ? LockIcon : UnlockIcon}
					iconProps={{
						onclick: () => (rules[index].isLocked = !rules[index].isLocked),
						class:
							'cursor-pointer text-white p-xs -mr-xs rounded-xs w-3xl h-3xl hover:bg-muted-background transition-colors'
					}}
				/>
			</li>
		{/each}
	</ul>
</div>
