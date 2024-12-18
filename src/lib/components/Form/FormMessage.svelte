<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';

	import { getContext } from 'svelte';
	import { type SuperForm } from 'sveltekit-superforms';

	interface FormMessageProps {
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	}

	let { superform, ...props }: FormMessageProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}

	let { message } = superform;
</script>

<div class="flex flex-col gap-xs">
	<p class={cn($message?.status === 'error' && 'text-destructive')}>{$message?.text}</p>
</div>
