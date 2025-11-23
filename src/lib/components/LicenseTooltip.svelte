<script lang="ts">
	import { licenses, type LicenseCode } from '$lib/schemas/license';
	import { Tooltip } from 'bits-ui';
	import { AlertCircleIcon, InfoIcon, LinkIcon, ThumbsUpIcon } from 'lucide-svelte';
	import Divider from './Divider.svelte';

	import { fly } from 'svelte/transition';
	let { license }: { license: LicenseCode } = $props();
	let licenseInfo = $derived(licenses[license]);
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger class="license-info-button group p-2xs" aria-label="License information">
			<InfoIcon class="size-4 transition-colors duration-300 group-hover:text-white" />
		</Tooltip.Trigger>
		<Tooltip.Content forceMount sideOffset={8}>
			{#snippet child({ props, open })}
				{#if open}
					<div {...props} transition:fly={{ y: 10, duration: 100 }}>
						<div
							class="shadow-popover z-10 flex max-w-(--breakpoint-sm) items-center justify-center rounded-form border border-shade-700 bg-shade-900 p-sm text-sm outline-none"
						>
							<div class="flex flex-col gap-sm">
								<div class="inline-flex items-center justify-between">
									<h5 class="text-white">{licenseInfo.code.toUpperCase()}</h5>
									<LinkIcon class="size-4" />
								</div>
								<h6 class="flex items-center gap-xs text-white">
									<ThumbsUpIcon class="size-4" /> Please do
								</h6>
								<ul class="flex flex-col gap-sm">
									{#each licenseInfo.allowed as { title, text }}
										<li>
											<p class="text-base font-bold text-white">{title}</p>
											<p>{text}</p>
										</li>
									{/each}
								</ul>
								<Divider />
								<h6 class="flex items-center gap-xs text-white">
									<AlertCircleIcon class="size-4" /> You must
								</h6>
								<ul class="flex flex-col gap-sm">
									{#each licenseInfo.terms as { title, text }}
										<li>
											<p class="text-base font-bold text-white">{title}</p>
											<p>{text}</p>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
