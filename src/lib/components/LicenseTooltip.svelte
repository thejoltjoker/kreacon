<script lang="ts">
	import { licenses, type LicenseCode } from '$lib/schemas/license';
	import { Tooltip } from 'bits-ui';
	import { CircleAlertIcon, InfoIcon, LinkIcon, ThumbsUpIcon } from 'lucide-svelte';
	import Divider from './Divider.svelte';

	let { license }: { license: LicenseCode } = $props();
	let licenseInfo = $derived(licenses[license]);
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger class="license-info-button group p-2xs" aria-label="License information">
			<InfoIcon class="size-4 transition-colors duration-300 group-hover:text-white" />
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				sideOffset={8}
				data-testid="license-tooltip"
				class="shadow-popover rounded-form border-shade-700 bg-shade-900 p-sm z-50 flex max-w-(--breakpoint-sm) items-center justify-center border text-sm outline-none"
			>
				<div class="gap-sm flex flex-col">
					<div class="inline-flex items-center justify-between">
						<h5 class="text-white">{licenseInfo.code.toUpperCase()}</h5>
						<LinkIcon class="size-4" />
					</div>
					<h6 class="gap-xs flex items-center text-white">
						<ThumbsUpIcon class="size-4" /> Please do
					</h6>
					<ul class="gap-sm flex flex-col">
						{#each licenseInfo.allowed as { title, text }, i (i)}
							<li>
								<p class="text-base font-bold text-white">{title}</p>
								<p>{text}</p>
							</li>
						{/each}
					</ul>
					<Divider />
					<h6 class="gap-xs flex items-center text-white">
						<CircleAlertIcon class="size-4" /> You must
					</h6>
					<ul class="gap-sm flex flex-col">
						{#each licenseInfo.terms as { title, text }, i (i)}
							<li>
								<p class="text-base font-bold text-white">{title}</p>
								<p>{text}</p>
							</li>
						{/each}
					</ul>
				</div>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
