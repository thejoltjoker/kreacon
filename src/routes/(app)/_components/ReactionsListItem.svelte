<script lang="ts" module>
	export interface ReactionListItem {
		url: string;
		image: { src: string; alt: string };
		value: string;
	}
	export interface ReactionsListItemProps {
		reaction: ReactionListItem;
	}
</script>

<script lang="ts">
	let { reaction }: ReactionsListItemProps = $props();
</script>

<li>
	<a
		href={reaction.url}
		class="group grid aspect-square items-center justify-center gap-sm overflow-hidden rounded-form"
	>
		<img
			src={reaction.image.src}
			alt={reaction.image.alt}
			class="col-[1] row-[1] h-full w-full object-cover"
		/>
		<div
			class="relative col-[1] row-[1] flex h-full w-full items-center justify-center bg-black/50 text-[48px] backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:text-3xl group-hover:backdrop-blur-none"
		>
			<p class="font-emoji transition-all group-hover:blur-sm">
				{reaction.value}
			</p>
		</div>
	</a>
</li>
