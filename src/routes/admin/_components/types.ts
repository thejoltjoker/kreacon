import type { Snippet } from "svelte";

export interface Item {
    [key: string]: unknown;
    id: number | string;
    thumbnailUrl?: string;
    name?: string;
}

export interface Field {
    name: string;
    minScreen: 'all' | 'sm' | 'md' | 'lg' | 'xl';
    sortable: boolean;
    customField?: Snippet;
}