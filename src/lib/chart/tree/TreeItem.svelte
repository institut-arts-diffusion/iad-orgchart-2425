<script lang="ts">
	import type { Datum } from '../../../app';
	import * as d3 from 'd3';

	const { data, onSelect }: { data: Datum; onSelect: (d: Datum) => void } = $props();
	let element: SVGGElement;

	const colorScale = d3.scaleLinear([0, 0.5, 1], ['#1ac0d7', '#76d143', '#f7b538']);

	$effect(() => {
		element.style.setProperty('--transform', `translate(${data.y}px,${data.x}px)`);
		if (data.data.contract) {
			element.style.setProperty('--color', colorScale(data.data.contract.cost_distribution));
		}
	});
	let onClick = (e: MouseEvent) => {
		e.preventDefault();
		onSelect(data);
	};
</script>

<g target="_blank" class="c-tree-item" bind:this={element}>
	<circle r={2.5} fill={data.children ? '#555' : '#999'} />
	<a href="/" onclick={onClick} class="c-tree-item__link">
		<text
			x={data.children ? -6 : 6}
			dy="0.32em"
			text-anchor={data.children ? 'end' : 'start'}
			paint-order="stroke"
			class="c-tree-item__text"
		>
			{data.data.name}
		</text>
	</a>
</g>
