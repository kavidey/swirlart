<script>
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/scene.svelte';
	import { onMount, onDestroy } from 'svelte';

	let width = 500;
	let height = 500;

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};
	onMount(() => {
		window.addEventListener('resize', resize);
		resize();
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize);
	});
</script>

<Canvas size={{ width, height }}>
	<Scene />
</Canvas>
