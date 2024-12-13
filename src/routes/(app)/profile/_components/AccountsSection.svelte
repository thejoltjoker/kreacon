<script lang="ts">
	import type { PageData } from '../$types';

	let { accounts = [] }: { accounts: PageData['accounts'] } = $props();
</script>

<div class="flex w-full flex-col gap-sm">
	<div class="flex items-center justify-between">
		<h2>Linked Accounts</h2>
	</div>

	{#if accounts.length === 0}
		<p>You haven't linked any accounts</p>
	{:else}
		<ul class="flex flex-col gap-sm">
			{#each accounts as account}
				<li
					class="flex flex-wrap items-center justify-between gap-sm rounded-md border border-muted-background p-md"
				>
					<p class="order-1 text-lg font-bold">{account.provider}</p>
					<p
						class="order-3 w-full whitespace-pre font-mono text-sm text-muted-foreground-alt sm:order-2 sm:w-auto"
					>
						#{account.providerAccountId}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
