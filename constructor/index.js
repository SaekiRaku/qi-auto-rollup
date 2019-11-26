import { rollup, watch } from "rollup"
import config from "./config.js";

export default {
    dev(callback) {
        let watcher = watch(config.input);
        watcher.on("event", (evt) => {
            if (evt.code == "END") {
                callback();
            }
        });
    },
    async build() {
        let bundle = await rollup(config.input).catch(e => {
            console.error(e);
        });

        for (let i in config.output) {
            let output = config.output[i];
            await bundle.write(output).catch(e => {
                console.error(e);
            })
        }
    }
}