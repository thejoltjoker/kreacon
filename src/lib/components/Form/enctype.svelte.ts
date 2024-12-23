import { getContext, setContext } from 'svelte';
import type { HTMLFormAttributes } from 'svelte/elements';
import { writable, type Writable } from 'svelte/store';

export const setEnctype = (
	value: HTMLFormAttributes['enctype'] = 'application/x-www-form-urlencoded'
) => {
	const enctype: Writable<HTMLFormAttributes['enctype']> = writable(value);
	setContext('enctype', enctype);
	return enctype;
};

export const getEnctype = () => {
	return getContext<Writable<HTMLFormAttributes['enctype']>>('enctype');
};
