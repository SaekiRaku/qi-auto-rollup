import fs from "fs";
import path from "path";
import Result from "./Result/index.js";
import utils from "./utils/index.js";

var Name = (options) => {
    if (!options.name) {
        options.name = "[folder]";
    }
    if (typeof options.name == "function") {
        return options.name
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
        }
    }
}

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
        }
        if (format == "esm") {
            tmp.file = path.resolve(utils.extractData(options.output, {
                filepath: entrypoint
            }), Name(entrypoint, options.name).replace(".js", ".es.js"))
        }
        tmp = Object.assign(tmp, utils.extractData(options.outputConfig, {
            filepath: entrypoint
        }));
        result.push(tmp);
    }

    return result;
}

export default function (options) {
    let entrypoints = this.filtered.length ? this.filtered : this.files;
    let result = new Result();

    Name = Name(options);

    for (let i in entrypoints) {
        let entry = entrypoints[i];
        let output = Output(entry, options);
        let input = {
            input: entry,
            output
        }
        input = Object.assign(input, utils.extractData(options.inputConfig, {
            filepath: entry
        }));

        result.config[entry] = {
            input,
            output
        }
    }

    return result;
}