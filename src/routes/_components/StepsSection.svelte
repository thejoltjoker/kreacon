<script>
	import { CameraIcon } from 'lucide-svelte';
</script>

<section class="px-4 py-16">
	<h2 class="mb-16 text-center text-4xl font-bold">How It Works</h2>
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
		<div class="flex flex-col items-center rounded-lg border border-shade-700 p-8 text-center">
			<CameraIcon class="mb-xl h-16 w-16" />
			<h3 class="mb-3 text-xl font-semibold">1. Create</h3>
			<p class="text-shade-300">Take a photo or select one from your gallery.</p>
		</div>

		<div class="flex flex-col items-center rounded-lg border border-shade-700 p-8 text-center">
			<div class="mb-6 h-16 w-16">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-full w-full"
				>
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
				</svg>
			</div>
			<h3 class="mb-3 text-xl font-semibold">2. Upload</h3>
			<p class="text-shade-300">Upload your submission to our platform.</p>
		</div>

		<div class="flex flex-col items-center rounded-lg border border-shade-700 p-8 text-center">
			<div class="mb-6 h-16 w-16">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					class="h-full w-full"
				>
					<circle cx="18" cy="5" r="3" />
					<circle cx="6" cy="12" r="3" />
					<circle cx="18" cy="19" r="3" />
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
			</div>
			<h3 class="mb-3 text-xl font-semibold">3. Share</h3>
			<p class="text-shade-300">Share your submission with the community to get more votes.</p>
		</div>
	</div>
</section>
