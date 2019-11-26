import qiauto from "@qiqi1996/qi-auto";
import common from "../common";
import plugin from "../dist/.cache/index.js";

const auto = new qiauto({
    "task1": {
        module: plugin,
        directory: common.path.EXAMPLE
    }
})

console.log(auto["task1"]);