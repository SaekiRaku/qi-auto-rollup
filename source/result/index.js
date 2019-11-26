class Event {
    constructor(options) {
        let {
            error,
            message,
            data
        } = options
        this.error = error;
        this.message = message;
        this.data = data;
    }

    toString() {
        if (this.error) {
            return "ERROR: " + this.message;
        } else {
            return this.data.toString();
        }
    }
}

export default class Result {
    constructor() {
        this.config = {
            /* AbsPathForKey: { input, output } */
        }
        this._watcher = {
            /* AbsPathForKey: { input, output } */
        }
    }

    watch(watch, callback) {
        if (!watch) {
            throw new Error("Please provid the rollup.watch");
        }
        for (let i in this.config) {
            this._watcher[i] = watch(this.config[i].input);
            this._watcher[i].on("event", function (evt) {
                if (evt.code == "ERROR" || evt.code == "FATAL") {
                    callback && callback(new Event({
                        error: true,
                        message: i,
                        data: evt
                    }));
                } else {
                    callback && callback(new Event({
                        error: false,
                        message: i,
                        data: evt
                    }));
                }
            });
        }
    }

    stop() {
        for (let i in this._watcher) {
            this._watcher[i].stop();
        }
    }

    async build(rollup, callback) {
        if (!rollup) {
            throw new Error("Please provid the rollup.rollup");
        }
        return new Promise(async (resolve, reject) => {
            for (let i in this.config) {
                let bundle = await rollup(this.config[i].input);
                for (let o in this.config[i].output) {
                    let outputConfig = this.config[i].output[o];
                    try {
                        await bundle.write(outputConfig)
                    } catch (err) {
                        let evt = new Event({
                            error: true,
                            message: i,
                            data: err
                        });
                        callback && callback(evt);
                        reject(evt);
                    }
                }
            }
            let evt = new Event({
                error: false,
                message: "done"
            })
            callback && callback(evt)
            resolve(evt);
        })
    }
}