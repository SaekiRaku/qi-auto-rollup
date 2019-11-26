export default class Result {
    constructor() {
        this.config = {
            /* AbsPathForKey: { input, output } */ }
    }

    async build(rollup) {
        if (!rollup) {
            throw new Error("Please provid the rollup");
        }
        return new Promise(async (resolve, reject) => {
            for (let i in this.config) {
                let bundle = await rollup(this.config[i].input);
                for (let o in this.config[i].output) {
                    let outputConfig = this.config[i].output[o];
                    try {
                        await bundle.write(outputConfig)
                    } catch (e) {
                        reject(e);
                    }
                }
            }
            resolve();
        })
    }
}