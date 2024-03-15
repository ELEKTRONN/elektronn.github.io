import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
	input: "js/_main.js",
	output: {
		file: "js/main.js",
		format: "iife"
	},
	plugins: [nodeResolve(), terser()]
};
