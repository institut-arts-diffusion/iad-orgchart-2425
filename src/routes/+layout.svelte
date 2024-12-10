<script lang="ts">
	import '../styles/main.scss';
	import type { Snippet } from 'svelte';
	import Logo from '../assets/logo-iad.svg';
	let { children }: { children: Snippet } = $props();
</script>

<main>
	<Logo class="c-orgchart-logo" />
	<!-- +page.svelte is `@render`ed here -->

	{@render children()}
</main>
