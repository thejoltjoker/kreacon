<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Pagination, type PaginationRootProps } from 'bits-ui';
	import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-svelte';

	interface Props extends PaginationRootProps {}

	let { count, perPage }: Props = $props();

	let searchParams = $state(new URLSearchParams($page.url.searchParams.toString()));
	let pageNum = $derived(Number(searchParams.get('page') ?? 1));

	// TODO Showing loading indicators
	// TODO What happens when a page doesn't exist
	// TODO Handling edge cases (first/last page)
	// TODO Recovery from failed requests

	const handlePageChange = (p: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', p.toString());
		searchParams = params;
		goto(`?${searchParams.toString()}`);
	};
</script>

<Pagination.Root
	page={pageNum}
	{count}
	{perPage}
	onPageChange={handlePageChange}
	class="flex flex-col items-center"
>
	{#snippet children({ pages, range })}
		<div class="my-xl flex items-center">
			<Pagination.PrevButton
				class="mr-sm inline-flex size-form items-center justify-center rounded-[9px] bg-transparent active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
			>
				<ChevronLeftIcon class="size-6" />
			</Pagination.PrevButton>
			<div class="flex items-center gap-2.5">
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<div class="text-foreground-alt select-none text-[15px] font-medium">...</div>
					{:else}
						<Pagination.Page
							{page}
							class="inline-flex size-form select-none items-center justify-center rounded-[9px] bg-transparent text-[15px] font-medium hover:bg-muted-background active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent data-[selected]:bg-muted-background data-[selected]:text-tertiary"
						>
							{page.value}
						</Pagination.Page>
					{/if}
				{/each}
			</div>
			<Pagination.NextButton
				class="ml-sm inline-flex size-form items-center justify-center rounded-[9px] bg-transparent active:scale-98 disabled:cursor-not-allowed disabled:text-muted-foreground hover:disabled:bg-transparent"
			>
				<ChevronRightIcon class="size-6" />
			</Pagination.NextButton>
		</div>
		<p class="text-center text-sm text-muted-foreground">
			Showing {range.start}-{range.end} of {count}
		</p>
	{/snippet}
</Pagination.Root>
