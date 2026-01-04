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
		<div class="gap-2xl flex flex-row">
			<div class="gap-sm flex flex-col items-center justify-center">
				<img src={qrCodeUrl} alt="QR Code" class="z-30 h-64 w-64 rounded bg-white p-2" />
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
			<div class="flex h-64 flex-col items-start justify-between">
				<h1 class="text-[5rem] leading-none font-bold">{data.entry?.title}</h1>
				<div
					class="gap-sm md:gap-xl pt-xl flex-justify-between flex w-full max-w-(--breakpoint-lg) flex-col"
				>
					<div class="gap-lg flex w-full flex-col text-left">
						<div class="flex flex-col">
							<h3 class="text-3xl font-bold">{entry?.user?.username}</h3>
							<span class="text-shade-300 text-left text-xl"> Author </span>
						</div>
						<div class="flex flex-col">
							<h3 class="text-3xl font-bold">{entry?.category?.name}</h3>
							<span class="text-shade-300 text-left text-xl"> Category </span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="image-wrapper z-10">
		<div class="image">
			<img
				class={cn(
					'h-full w-full object-cover opacity-25',
					entry?.category?.name?.toLowerCase().includes('oldschool graphics') && 'render-pixelated'
				)}
				src={`${data.entry?.media?.url}`}
				alt={data.entry?.title}
			/>
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../../../app.css";

	#letterbox {
		border: 1px dashed var(--color-shade-300);
		@apply aspect-cover gap-xl absolute top-[50%] left-[50%] flex w-full -translate-x-1/2 -translate-y-1/2 flex-row items-center justify-center text-center;
	}
	#cover-container {
		@apply absolute top-0 left-0 h-screen w-screen overflow-hidden bg-black;
	}

	.image-wrapper {
		@apply h-full w-full overflow-hidden;
	}
	.image {
		@apply -m-[5%] h-[110%] w-[110%] blur-[25px];
	}
</style>
