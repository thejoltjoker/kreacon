<script lang="ts">
	import { Label, type LabelRootProps } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label: string;
		labelProps?: Omit<LabelRootProps, 'for'>;
	}

	let { type = 'text', label, labelProps, name, value = $bindable(), ...props }: Props = $props();
</script>

<Label.Root {...labelProps} for={name}>
	<span>{label}</span>
	<input {...props} {type} {name} bind:value />
</Label.Root>
