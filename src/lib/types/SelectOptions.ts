export type SelectOptions = SelectOptionGroup[];

export interface SelectOptionGroup {
	groupLabel: string;
	options: SelectOption[];
}

export interface SelectOption {
	value: string;
	label: string;
	isDisabled: boolean;
}
