import path from "path";
import { rollup } from "rollup";
import qiauto from "@qiqi1996/qi-auto";

import common from "../common";
import plugin from "../dist/.cache/index.js";

const PATH_LIBRARY = path.resolve(common.path.EXAMPLE, "library");
const PATH_DIST = path.resolve(common.path.EXAMPLE, "dist");

const auto = new qiauto({
    "library": {
        module: plugin,
        filter: /index\.js/,
        directory: PATH_LIBRARY,
        options: {
            name: "[folder].js",
            output: function (ctx) {
                return path.resolve(PATH_DIST, path.basename(path.dirname(ctx.filepath)));
            },
            format: ["cjs", "esm"],
            inputConfig: {},
            onputConfig: {},
        }
    }
})

console.log(auto["library"]);

try {
    auto["library"].build(rollup)
} catch (e) {
    console.error(e);
}