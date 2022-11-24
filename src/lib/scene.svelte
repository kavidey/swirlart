<script lang="ts">
	import { OrbitControls, T, Three, useThrelte } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import {
		PerspectiveCamera,
		BufferGeometry,
		Float32BufferAttribute,
		PointsMaterial,
		Points,
		Color,
		Fog,
		FogExp2
	} from 'three';
	import type { config } from '$lib/config';

	import { parse } from 'mathjs';

	let lead_points: number[] = [];
	let lead_colors: number[] = [];

	let trail_points: number[] = [];
	let trail_colors: number[] = [];

	export let config: config;
	export const reset = () => {
		dx = parse(config.field.dx).compile();
		dy = parse(config.field.dy).compile();
		dz = parse(config.field.dz).compile();
		additionalVars = JSON.parse(config.field.additionalVars);
		setup();
	};

	let dx = parse(config.field.dx).compile();
	let dy = parse(config.field.dy).compile();
	let dz = parse(config.field.dz).compile();
	let additionalVars = JSON.parse(config.field.additionalVars);

	function addLeadingPoints() {
		for (let i = 0; i < config.spawner.density - lead_points.length; i++) {
			let x = Math.random() * config.spawner.bounds.x - config.spawner.bounds.x / 2;
			let y = Math.random() * config.spawner.bounds.y - config.spawner.bounds.y / 2;
			let z = Math.random() * config.spawner.bounds.z - config.spawner.bounds.z / 2;
			lead_points.push(x, y, z);

			lead_colors.push(25 / 255, 178 / 255, 209 / 255);
		}
	}

	function removeLeadingPoints() {
		let new_points: number[] = [];
		let new_colors: number[] = [];

		for (let i = 0; i < lead_points.length; i += 3) {
			if (Math.random() > config.rendering.resetChance) {
				new_points.push(lead_points[i], lead_points[i + 1], lead_points[i + 2]);
				new_colors.push(lead_colors[i], lead_colors[i + 1], lead_colors[i + 2]);
			}
		}
		lead_points = new_points;
		lead_colors = new_colors;
	}

	function removeTrailPoints() {
		trail_colors = trail_colors.map((c) => c * config.rendering.decayRate);

		let new_trail_points: number[] = [];
		let new_trail_colors: number[] = [];

		for (let i = 0; i < trail_points.length; i += 3) {
			const x = trail_points[i];
			const y = trail_points[i + 1];
			const z = trail_points[i + 2];

			const r = trail_colors[i];
			const g = trail_colors[i + 1];
			const b = trail_colors[i + 2];

			const threshold = 0.05;

			if (r > threshold || g > threshold || b > threshold) {
				new_trail_points.push(x, y, z);
				new_trail_colors.push(r, g, b);
			}
		}

		trail_points = new_trail_points;
		trail_colors = new_trail_colors;
	}

	function step() {
		const new_points: number[] = [];
		const new_colors: number[] = [];
		for (let i = 0; i < lead_points.length / 3; i++) {
			let x = lead_points[i * 3 + 0];
			let y = lead_points[i * 3 + 1];
			let z = lead_points[i * 3 + 2];

			// let r = Math.sqrt(x * x + y * y + z * z);
			// let theta = Math.atan2(y, x);
			// let phi = Math.acos(z / r);

			// let r_dot = 1;
			// let theta_dot = 1 / r;
			// let phi_dot = 1 / (r * Math.sin(phi));

			// let dx =
			// 	r_dot * Math.cos(theta) * Math.sin(phi) +
			// 	r * theta_dot * Math.sin(theta) * Math.sin(phi) -
			// 	r * phi_dot * Math.cos(theta) * Math.cos(phi);
			// let dy =
			// 	r_dot * Math.sin(theta) * Math.sin(phi) -
			// 	r * theta_dot * Math.cos(theta) * Math.sin(phi) -
			// 	r * phi_dot * Math.sin(theta) * Math.cos(phi);
			// let dz = r_dot * Math.cos(phi) + r * phi_dot * Math.sin(phi);

			// let dx = 0.1;
			// let dy = 0.1;
			// let dz = 0.1;

			const scope = {
				x,
				y,
				z,
				...additionalVars,
			};

			let pdx = dx.evaluate(scope);
			let pdy = dy.evaluate(scope);
			let pdz = dz.evaluate(scope);

			trail_points.push(x, y, z);
			trail_colors.push(lead_colors[i * 3 + 0], lead_colors[i * 3 + 1], lead_colors[i * 3 + 2]);

			lead_points[i * 3 + 0] += pdx * config.rendering.integrationStep;
			lead_points[i * 3 + 1] += pdy * config.rendering.integrationStep;
			lead_points[i * 3 + 2] += pdz * config.rendering.integrationStep;
		}
	}

	function advectPoints() {
		addLeadingPoints();

		step();

		removeTrailPoints();
		removeLeadingPoints();

		lead_points = [...lead_points];
		lead_colors = [...lead_colors];

		trail_points = [...trail_points];
		trail_colors = [...trail_colors];
	}

	function setup() {
		lead_points = [];
		lead_colors = [];
		trail_points = [];
		trail_colors = [];

		for (let i = 0; i < 10; i++) {
			addLeadingPoints();

			step();
		}

		lead_points = [...lead_points];
		lead_colors = [...lead_colors];

		trail_points = [...trail_points];
		trail_colors = [...trail_colors];
	}

	onMount(() => {
		setup();
	});

	let advectInterval: any;
	onMount(() => {
		advectInterval = setInterval(() => {
			if (!config.pause) {
				advectPoints();
			}
		}, 10);
	});
	onDestroy(() => {
		clearInterval(advectInterval);
	});

	const { scene } = useThrelte();
	scene.background = new Color('#000000');
	// scene.fog = new FogExp2('#000000', 0.001);
</script>

<Three
	type={PerspectiveCamera}
	makeDefault
	position={[2 * config.spawner.bounds.x, 2 * config.spawner.bounds.y, 2 * config.spawner.bounds.z]}
	fov={24}
	far={10000}
>
	<OrbitControls target={{ y: 0 }} enableZoom={true} />
</Three>

<!-- <Three type={Points}>
	<Three
		type={BufferGeometry}
		attributes={{
			position: new Float32BufferAttribute(lead_points, 3),
			color: new Float32BufferAttribute(lead_colors, 3)
		}}
	/>
	<Three type={PointsMaterial} vertexColors={true} size={config.rendering.pointSize} fog={true} />
</Three> -->
<Three type={Points}>
	<Three
		type={BufferGeometry}
		attributes={{
			position: new Float32BufferAttribute(trail_points, 3),
			color: new Float32BufferAttribute(trail_colors, 3)
		}}
	/>
	<Three type={PointsMaterial} vertexColors={true} size={config.rendering.pointSize} fog={true} />
</Three>
