import type { SelectOptions } from './Select.types';

export const isGroupedOptions = (
	opts: SelectOptions
): opts is Record<
	string,
	{ groupLabel: string; options: Array<{ value: string; label: string; isDisabled?: boolean }> }
> => {
	return (
		typeof opts === 'object' &&
		Object.values(opts).every(
			(group) => 'groupLabel' in group && 'options' in group && Array.isArray(group.options)
		)
	);
};
