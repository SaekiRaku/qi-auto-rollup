import assert from "assert";
import qiauto from "@qiqi1996/qi-auto";
import common from "../common";

describe("qi-auto-plugin-template", function () {
    it("should return 'qi-auto' as result", function () {
        let auto = new qiauto({
            "task1": {
                module: require("../dist/qi-auto-plugin-template.js"),
                directory: common.path.EXAMPLE
            }
        });

        assert.equal(auto["task1"], "qi-auto")
    });
});