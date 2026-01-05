<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import { createPublicUrl } from '$lib/utils';
	import QRCode from 'qrcode';
	import { cn } from '$lib/utils';

	let { data }: PageProps = $props();
	let entry = $derived(data.entry);

	let qrCodeUrl = $state<string>('');

	onMount(async () => {
		if (data.entry?.id) {
			const entryUrl = createPublicUrl(`/entries/${data.entry.id}`);
			try {
				qrCodeUrl = await QRCode.toDataURL(entryUrl, {
					width: 200,
					margin: 1,
					color: {
						dark: '#000000',
						light: '#FFFFFF'
					}
				});
			} catch (error) {
				console.error('Error generating QR code:', error);
			}
		}
	});
</script>

<div id="cover-container">
	<div id="letterbox" class="z-20">
		<div class="flex flex-col">
			<div class="gap-sm flex flex-col items-center justify-center">
				<img
					src={qrCodeUrl}
					alt={entry?.title
						? `QR code linking to entry "${entry.title}"`
						: 'QR code linking to entry details'}
					class="z-30 h-64 w-64 rounded bg-white p-2"
				/>
				<div
					class="group px-2xs py-2xs pr-sm inline-flex w-fit items-center gap-3 rounded-full border text-sm font-bold transition-colors"
				>
					<div
						class="focus:ring-ring px-xs py-3xs inline-flex items-center rounded-full border border-transparent bg-white text-xs font-bold text-black uppercase transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
					>
						id
					</div>
					{entry?.id}
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../../../app.css";

	#letterbox {
		/* border: 1px dashed var(--color-shade-300); */
		@apply aspect-cover gap-xl absolute top-[50%] left-[50%] flex w-full -translate-x-1/2 -translate-y-1/2 flex-row items-center justify-center text-center;
	}
	#cover-container {
		@apply absolute top-0 left-0 h-screen w-screen overflow-hidden bg-black;
	}
</style>
