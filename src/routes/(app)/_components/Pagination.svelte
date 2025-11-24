<script lang="ts">
	import { Pagination, type PaginationRootProps } from 'bits-ui';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';
	import { t } from '$lib/i18n';

	let { count, perPage, ...props }: PaginationRootProps = $props();

	let searchParams = new SvelteURLSearchParams($page.url.searchParams);
	let pageNum = $derived(Number(searchParams.get('page') ?? 1));

	// TODO Showing loading indicators
	// TODO What happens when a page doesn't exist
	// TODO Handling edge cases (first/last page)
	// TODO Recovery from failed requests

	const handlePageChange = (p: number) => {
		searchParams.set('page', p.toString());
		goto(resolve(`?${searchParams.toString()}`), { replaceState: true });
	};

	let rootClassName = cn('flex flex-col items-center pagination', props.class);
	let buttonBaseClass = cn(
		'flex size-form items-center justify-center rounded-form transition-colors text-shade-400',
		'disabled:cursor-normal disabled:text-shade-600',
		'hover:disabled:bg-transparent hover:bg-shade-800 hover:text-white'
	);
</script>

<Pagination.Root
	page={pageNum}
	{count}
	{perPage}
	onPageChange={handlePageChange}
	class={rootClassName}
	{...props}
>
	{#snippet children({ pages, range })}
		<div class="my-xl flex items-center">
			<Pagination.PrevButton aria-label="Previous page" class={cn(buttonBaseClass, 'mr-sm')}>
				<ChevronLeftIcon class="size-6" />
			</Pagination.PrevButton>
			<div class="flex items-center gap-2.5">
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<div class="text-foreground-alt font-medium select-none">...</div>
					{:else}
						<Pagination.Page
							{page}
							class={cn(
								buttonBaseClass,
								'data-selected:bg-shade-800 data-selected:hover:bg-shade-700 data-selected:text-white'
							)}
						>
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
			</div>
			<Pagination.NextButton aria-label="Next page" class={cn(buttonBaseClass, 'ml-sm')}>
				<ChevronRightIcon class="size-6" />
			</Pagination.NextButton>
		</div>
		<p class="text-shade-300 text-center text-sm">
			{$t('Showing')}
			{range.start}-{range.end} of {count}
		</p>
	{/snippet}
</Pagination.Root>
