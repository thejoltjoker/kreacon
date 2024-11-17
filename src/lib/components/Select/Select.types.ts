import type { SelectOption as MeltSelectOption } from '@melt-ui/svelte';

export type SelectOption = MeltSelectOption<string>;

export interface SelectGroup {
	value: SelectOption[];
	label: string;
}

export type SelectOptions = (SelectGroup | SelectOption)[];
