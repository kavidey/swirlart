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

	// import math from 'mathjs';

	const scale = 200;
	const num_points = 300;
	const num_iterations = 30;
	const derivative_scale = 0.5;

	let lead_points: number[] = [];
	let lead_colors: number[] = [];

	let trail_points: number[] = [];
	let trail_colors: number[] = [];

	function addLeadingPoints() {
		for (let i = 0; i < num_points; i++) {
			let x = Math.random() * scale - scale / 2;
			let y = Math.random() * scale - scale / 2;
			let z = Math.random() * scale - scale / 2;
			lead_points.push(x, y, z);

			lead_colors.push(Math.random(), Math.random(), Math.random());
		}
	}

	function removeLeadingPoints() {
		lead_points.splice(0, num_points * 3);
		lead_colors.splice(0, num_points * 3);
	}

	function removeTrailPoints() {
		const to_remove = lead_points.length - num_points * 3;
		// trail_points.splice(trail_points.length - to_remove, to_remove);
		// trail_colors.splice(trail_points.length - to_remove, to_remove);
		trail_points.splice(0, to_remove);
		trail_colors.splice(0, to_remove);
	}

	function step() {
		const new_points: number[] = [];
		const new_colors: number[] = [];
		for (let i = 0; i < lead_points.length / 3; i++) {
			let x = lead_points[i * 3 + 0];
			let y = lead_points[i * 3 + 1];
			let z = lead_points[i * 3 + 2];

			let r = Math.sqrt(x * x + y * y + z * z);
			let theta = Math.atan2(y, x);
			let phi = Math.acos(z / r);

			let r_dot = 1;
			let theta_dot = 1 / r;
			let phi_dot = 1 / (r * Math.sin(phi));

			let dx =
				r_dot * Math.cos(theta) * Math.sin(phi) +
				r * theta_dot * Math.sin(theta) * Math.sin(phi) -
				r * phi_dot * Math.cos(theta) * Math.cos(phi);
			let dy =
				r_dot * Math.sin(theta) * Math.sin(phi) -
				r * theta_dot * Math.cos(theta) * Math.sin(phi) -
				r * phi_dot * Math.sin(theta) * Math.cos(phi);
			let dz = r_dot * Math.cos(phi) + r * phi_dot * Math.sin(phi);

			new_points.push(x, y, z);
			new_colors.push(lead_colors[i * 3 + 0], lead_colors[i * 3 + 1], lead_colors[i * 3 + 2]);

			lead_points[i * 3 + 0] += dx * derivative_scale;
			lead_points[i * 3 + 1] += dy * derivative_scale;
			lead_points[i * 3 + 2] += dz * derivative_scale;
		}

		trail_points = [...trail_points, ...new_points];
		trail_colors = [...trail_colors, ...new_colors];
	}

	function advectPoints() {
		removeLeadingPoints();
		addLeadingPoints();
		removeTrailPoints();
		step();
	}

	for (let i = 0; i < num_iterations; i++) {
		addLeadingPoints();
		step();
	}

	let advectInterval: any;
	onMount(() => {
		advectInterval = setInterval(advectPoints, 20);
	});
	onDestroy(() => {
		clearInterval(advectInterval);
	});

	const { scene } = useThrelte();
	scene.background = new Color('#000000');
	scene.fog = new Fog('#000000', scale*2.5, scale*4);
	// scene.fog = new FogExp2('#000000', 0.001);
</script>

<Three type={PerspectiveCamera} makeDefault  position={[scale*2, scale*2, scale*2]} fov={24}>
	<OrbitControls target={{ y: 0 }} enableZoom={false} />
</Three>

<Three type={Points}>
	<Three
		type={BufferGeometry}
		attributes={{
			position: new Float32BufferAttribute(lead_points, 3),
			color: new Float32BufferAttribute(lead_colors, 3)
		}}
	/>
	<Three type={PointsMaterial} vertexColors={true} size={3} fog={true} />
</Three>
<Three type={Points}>
	<Three
		type={BufferGeometry}
		attributes={{
			position: new Float32BufferAttribute(trail_points, 3),
			color: new Float32BufferAttribute(trail_colors, 3)
		}}
	/>
	<Three type={PointsMaterial} vertexColors={true} size={3} fog={true} />
</Three>
