<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { PageData } from './$types';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/Button.svelte';
	import { TrashIcon } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import DeleteButton from './_components/DeleteButton.svelte';

	export let data: PageData;
</script>

<div class="w-full rounded-form">
	<ul class="flex w-full flex-col gap-sm">
		{#each data.events as event}
			<li
				class="flex gap-sm border-b border-b-divider px-xl pb-sm first-of-type:pt-sm last-of-type:border-b-0"
			>
				{#each Object.entries(event) as [key, value]}
					<Tooltip.Provider>
						<Tooltip.Root delayDuration={200}>
							<Tooltip.Trigger class="flex flex-1 flex-col items-start overflow-hidden text-left">
								<p class="w-full truncate font-bold">
									{#if value instanceof Date}
										{value.toLocaleString('en-GB', {
											hour: '2-digit',
											minute: '2-digit',
											day: '2-digit',
											month: 'short',
											year: 'numeric'
										})}
									{:else}
										{value}
									{/if}
								</p>
								<p class="truncate text-sm text-muted-foreground">{key}</p>
							</Tooltip.Trigger>
							<Tooltip.Content sideOffset={8}>
								<div
									class="border-dark-10 shadow-popover z-0 flex max-w-screen-lg items-center justify-center text-wrap rounded-form border bg-black p-3 text-sm font-medium outline-none"
								>
									{#if value instanceof Date}
										{value.toLocaleString('en-GB', {
											hour: '2-digit',
											minute: '2-digit',
											day: '2-digit',
											month: 'short',
											year: 'numeric'
										})}
									{:else}
										{value}
									{/if}
								</div>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/each}
				<div class="w-fit">
					<DeleteButton />
					<form method="POST" action="?/delete" use:enhance>
						<input type="hidden" name="id" value={event.id} />
						<Button
							type="submit"
							variant="outline"
							size="icon"
							class="border-destructive hover:bg-destructive/20 hover:text-destructive"
						>
							<TrashIcon />
						</Button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
</div>
