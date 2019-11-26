import path from "path";

import strip from "@rollup/plugin-strip";
import babel from 'rollup-plugin-babel';

import common from "../common";

const {
    name
} = common.manifest;

const plugins = [
    strip(),
    babel()
]

export default {
    input: {
        input: path.resolve(common.path.SOURCE, "index.js"),
        output: {
            name,
            format: "cjs",
            file: path.resolve(common.path.DIST, ".cache", "index.js")
        },
        plugins
    },
    output: [{
            name,
            format: "cjs",
            file: path.resolve(common.path.DIST, name + ".js")
        },
        {
            name,
            format: "esm",
            file: path.resolve(common.path.DIST, name + ".es.js")
        }
    ]
}