import fs from 'fs';
import path from 'path';

class Result {
  constructor() {
    this.config = {
      /* AbsPathForKey: { input, output } */
    };
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
            await bundle.write(outputConfig);
          } catch (e) {
            reject(e);
          }
        }
      }

      resolve();
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
    return options.name;
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
  var formats = options.format;

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
    result.config[entry] = {
      input,
      output
    };
  }

  return result;
}

export default index;
