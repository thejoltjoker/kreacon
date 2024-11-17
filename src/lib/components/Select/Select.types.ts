export type SelectOptions = SelectOption[];

export interface SelectOption {
	label: string;
	value?: string;
	isDisabled?: boolean;
	options?: SelectOption[];
}
