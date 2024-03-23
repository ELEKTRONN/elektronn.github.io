import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPixelatedPass } from "three/addons/postprocessing/RenderPixelatedPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function createRenderer($canvas, pixelRatio = 1, isAntiAlias = false) {
	const renderer = new THREE.WebGLRenderer({
		canvas: $canvas,
		antialias: pixelRatio < 2 && isAntiAlias,
		powerPreference: "high-performance"
	});
	renderer.setPixelRatio(Math.min(pixelRatio, 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	return renderer;
}

const UPDATE_CLOCK = new THREE.Clock();
let t = 0;
let dt = 0;
let FPS_INTERVAL = 1 / 60;

const wireframeMaterial = new THREE.MeshBasicMaterial({
	color: "white",
	wireframe: true,
});

class Floor extends THREE.Group {
	constructor() {
		super();
		const grid = new THREE.GridHelper(2, 10, 0xc2c2c2);
		grid.material.color.setHex(0xebebeb);
		this.add(grid);
		this.renderOrder = 1;
	}
}

class Canvas {
	constructor($container, mitochondria) {
		this.mitochondria = mitochondria;
		this.scene = new THREE.Scene();

		const aspect = $container.clientWidth / $container.clientHeight;
		this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
		this.camera.position.set(.5, 1.5, 4);

		this.renderer = createRenderer($container);
		this.renderer.shadowMap.enabled = true;
		this.renderer.setSize($container.clientWidth, $container.clientHeight, false);

		this.composer = new EffectComposer(this.renderer);
		const renderPixelatedPass = new RenderPixelatedPass(1, this.scene, this.camera);
		this.composer.addPass(renderPixelatedPass);
		const outputPass = new OutputPass();
		this.composer.addPass(outputPass);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableZoom = false;
		this.controls.enablePan = false;

		const floor = new Floor();
		this.scene.add(floor);

		this.scene.add(new THREE.AmbientLight(0x757f8e, 5));

		const spotLight = new THREE.SpotLight(0xffc100, 50, 10, Math.PI / 16, .02, 2);
		spotLight.position.set(.5, 2, .5);
		const target = spotLight.target;
		this.scene.add(target);
		target.position.copy(mitochondria.position);
		spotLight.castShadow = true;
		this.scene.add(spotLight);
	}

	update(dt) {
		this.controls.update(dt);
		const t = UPDATE_CLOCK.getElapsedTime();
		this.mitochondria.position.y = 0.289772 + Math.sin(t * 2) * .01;
	}

	draw() {
		this.composer.render();
	}

	onResize() {
		const container = document.getElementById("Canvas").parentNode;
		const aspectRatio = container.clientWidth / container.clientHeight;
		this.camera.left = -aspectRatio;
		this.camera.right = aspectRatio;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		this.composer.setSize(container.clientWidth, container.clientHeight);
	}
}

const gltf = new GLTFLoader().load("/images/Mesh.glb", (data) => {
	const mitochondria = data.scene.children.filter((m) => m.name === "Mitochondria")[0];
	const wireframes = data.scene.children.filter((m) => m.name.indexOf("Wireframe") > -1);
	wireframes.forEach((m) => { m.material = wireframeMaterial; });

	const canvas = new Canvas(document.getElementById("Canvas"), mitochondria, wireframes);
	canvas.scene.add(...data.scene.children);
	canvas.renderer.setAnimationLoop(() => {
		dt = UPDATE_CLOCK.getDelta();
		t += dt;
		canvas.update(dt);

		if (t >= FPS_INTERVAL) {
			canvas.draw();
			t = t % FPS_INTERVAL;
		}
	});

	window.addEventListener("resize", () => { canvas.onResize(); });
});
