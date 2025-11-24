<script lang="ts">
	import monsterUpload from '../../assets/images/monster-beam-001.png';
	import monsterShare from '../../assets/images/monster-bones-001.png';
	import monsterCreate from '../../assets/images/monster-troll-003.png';
	import { t } from '$lib/i18n';
</script>

{#snippet item(title: string, text: string, imageUrl: string)}
	<div class="flex w-full flex-col items-center text-center">
		<img class="h-[260px] w-[260px]" src={imageUrl} alt="Monster" />
		<h3 class="mb-3 text-xl font-semibold">{title}</h3>
		<p class="text-shade-300">{text}</p>
	</div>
{/snippet}

<section class="flex w-full max-w-(--breakpoint-xl) flex-col items-center">
	<h2 class="text-center text-4xl font-bold">How It Works</h2>
	<div class="gap-xl grid w-full grid-cols-1 md:grid-cols-3">
		{@render item(
			`1. ${$t('Create')}`,
			$t('Unleash your creativity using your favorite tools.'),
			monsterCreate
		)}
		{@render item(
			`2. ${$t('Upload')}`,
			$t('Share your work with our growing community.'),
			monsterUpload
		)}
		{@render item(
			`3. ${$t('Share and Vote')}`,
			$t('Get feedback, inspire others, and climb the rankings.'),
			monsterShare
		)}
	</div>
</section>
