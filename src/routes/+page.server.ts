import type { PageServerLoad } from './$types';
import type { ChartItem } from '../app';

export const load: PageServerLoad = async ({ fetch }) => {
	const groups = await fetch('https://iadpp.iad-arts.be/api/orgchart').then<ChartItem[]>((res) =>
		res.json()
	);

	const data = groups
		.map((d) => (d.parent_id ? d : { ...d, parent_id: 'root_0' }));

	return {
		groups: [
			...data,
			{
				id: 'root_0',
				parent_id: null,
				name: 'IAD',
				type: 'root'
			}
		]
	};
};
