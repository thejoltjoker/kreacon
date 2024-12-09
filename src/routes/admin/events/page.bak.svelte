<script lang="ts">
	import { t } from '$lib/i18n';
	import { Tooltip } from 'bits-ui';
	import startCase from 'lodash/startCase';
	import FilterBar from '../_components/EventFilterBar.svelte';
	import type { PageData } from './$types';
	import DeleteButton from './_components/DeleteButton.svelte';
	export let data: PageData;
</script>

<FilterBar />
<div class="w-full rounded-form">
	<ul class="events-list flex w-full flex-col gap-sm">
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
								<p class="truncate text-sm text-muted-foreground">{$t(startCase(key))}</p>
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
					<DeleteButton bind:eventId={event.id} />
				</div>
			</li>
		{/each}
	</ul>
</div>
