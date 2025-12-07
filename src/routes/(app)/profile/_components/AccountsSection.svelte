<script lang="ts">
	import type { PageData } from '../$types';

	let { accounts = [] }: { accounts: PageData['accounts'] } = $props();
</script>

<div class="gap-sm flex w-full flex-col">
	<div class="flex items-center justify-between">
		<h2>Linked Accounts</h2>
	</div>

	{#if accounts.length === 0}
		<p>You haven't linked any accounts</p>
	{:else}
		<ul class="gap-sm flex flex-col">
			{#each accounts as account (account.providerAccountId)}
				<li
					class="gap-sm border-muted-background p-md flex flex-wrap items-center justify-between rounded-md border"
				>
					<p class="order-1 text-lg font-bold">{account.provider}</p>
					<p
						class="text-shade-300-alt order-3 w-full font-mono text-sm whitespace-pre sm:order-2 sm:w-auto"
					>
						#{account.providerAccountId}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
