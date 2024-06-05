import { register } from "ts-node"
import { resolve } from "path"

const tsconfigPath = resolve(__dirname, "tsconfig.json") // Adjust if needed

register({
	project: tsconfigPath, // Use your tsconfig.json for correct TypeScript configuration
	compilerOptions: {
		module: "NodeNext", // Set module type for ES Modules
		moduleResolution: "NodeNext", // Resolve modules like Node.js
	},
	transpileOnly: true, // Skip type checking for faster startup
})
