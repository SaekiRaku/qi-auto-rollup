import fs from 'fs';
import path from 'path';

class Event {
  constructor(options) {
    let {
      error,
      message,
      data
    } = options;
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

class Result {
  constructor() {
    this.config = {
      /* AbsPathForKey: { input, output } */
    };
    this._watcher = {
      /* AbsPathForKey: { input, output } */
    };
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
            await bundle.write(outputConfig);
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
      });
      callback && callback(evt);
      resolve(evt);
    });
  }

}

function extractData(data, args) {
  if (typeof data == "function") {
    return data(args);
  } else {
    return data;
  }
}

var utils = {
  extractData
};

var Name = options => {
  if (!options.name) {
    options.name = "[folder]";
  }

  if (typeof options.name == "function") {
    return function (filepath) {
      return utils.extractData(options.name, {
        filepath
      });
    };
  }

  if (typeof options.name == "string") {
    return function (filepath, name) {
      if (name.indexOf("[folder]") != -1 && !fs.statSync(filepath).isDirectory()) {
        name = name.replace(/\[folder\]/g, path.basename(path.resolve(filepath, "../")));
      }

      if (name.indexOf("[name]") != -1) {
        name = name.replace(/\[name\]/g, path.basename(filepath, path.extname(filepath)));
      }

      if (name.indexOf("[ext]") != -1) {
        name = name.replace(/\[ext\]/g, path.extname(filepath));
      }

      return name;
    };
  }
};

function Output(entrypoint, options) {
  var formats = utils.extractData(options.format, {
    filepath: entrypoint
  });

  if (typeof options.format == "string") {
    formats = [formats];
  }

  let result = [];

  for (let i in formats) {
    let format = formats[i];
    let tmp = {
      name: Name(entrypoint, options.name),
      format: format,
      file: path.resolve(utils.extractData(options.output, {
        filepath: entrypoint
      }), Name(entrypoint, options.name))
    };

    if (format == "esm") {
      tmp.file = path.resolve(utils.extractData(options.output, {
        filepath: entrypoint
      }), Name(entrypoint, options.name).replace(".js", ".es.js"));
    }

    tmp = Object.assign(tmp, utils.extractData(options.outputConfig, {
      filepath: entrypoint
    }));
    result.push(tmp);
  }

  return result;
}

function index (options) {
  let entrypoints = this.filtered.length ? this.filtered : this.files;
  let result = new Result();
  Name = Name(options);

  for (let i in entrypoints) {
    let entry = entrypoints[i];
    let output = Output(entry, options);
    let input = {
      input: entry,
      output
    };
    input = Object.assign(input, utils.extractData(options.inputConfig, {
      filepath: entry
    }));
    result.config[entry] = {
      input,
      output
    };
  }

  return result;
}

export default index;
