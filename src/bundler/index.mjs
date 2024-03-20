import process from "node:process"
import {rollup} from "rollup"
import resolve from "@rollup/plugin-node-resolve"

import path from "node:path"
import fs from "node:fs/promises"
import {generateTemporaryPathName} from "@anio-node-foundation/fs-utils"

export default async function(project_root, relative_path) {
	const output = await generateTemporaryPathName() + ".mjs"

	const rollup_options = {
		input: path.join("resources", "esmodule", relative_path),

		output: {
			file: output,
			format: "es"//,
			//inlineDynamicImports: true
		},

		plugins: [resolve()],

		onLog(level, error, handler) {
			//print(
			//	`    [${level}] rollup says ${error.message}\n`
			//)
		}
	}

	const cwd = process.cwd()

	// needed for rollup-node-resolve plugin
	process.chdir(project_root)

	try {
		const bundle = await rollup(rollup_options)

		await bundle.write(rollup_options.output)

		const esmodule = await fs.readFile(output)

		await fs.unlink(output)

		return esmodule.toString()
	} finally {
		process.chdir(cwd)
	}
}