<script lang="ts">
	import type { Datum } from '../../../app';
	import * as d3 from 'd3';

	const { data, onSelect }: { data: Datum; onSelect: (d: Datum) => void } = $props();
	let element: HTMLElement;

	const colorScale = d3.scaleLinear([0, 0.5, 1], ['#1ac0d7', '#76d143', '#f7b538']);

	$effect(() => {
		element.style.setProperty('--transform', `translate(${data.x}px,${data.y}px)`);
		if (data.data.contract) {
			element.style.setProperty('--color', colorScale(data.data.contract.cost_distribution));
		}
	});
	let onClick = (e: MouseEvent) => {
		e.preventDefault();
		onSelect(data);
	};
</script>

<a
	class="c-pack-item"
	data-depth={data.depth}
	data-height={data.height}
	data-type={data.data.type}
	data-name={data.data.name}
	bind:this={element}
	aria-label={data.data.name}
	href={data.data.name}
	onclick={onClick}
>
	<title>{data.data.name}</title>
	<circle class="c-pack-item__circle" r={data.r} />
</a>
