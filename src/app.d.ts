// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {}
}

interface ChartItem {
	id: string;
	parent_id?: string;
	name: string;
	type: string;
	person?: string;
	contract?: Contract;
	fraction?: number;
	occupation?: Occupation;
}

export interface Contract {
	id: string;
	name: string;
	slug: string;
	fraction: number;
	description: string;
	created_at: string;
	updated_at: string;
	deleted_at: string;
	cost_distribution: number;
}

export interface Occupation {
	id: string;
	name: string;
	slug: string;
	description?: string;
	created_at: string;
	updated_at: string;
	deleted_at: string;
}

export { ChartItem };
