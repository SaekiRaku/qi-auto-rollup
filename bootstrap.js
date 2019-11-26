import constructor from "./constructor";

const cmd = process.argv[2];

switch (cmd) {
    case "dev":
        constructor.dev(() => {
            for (let i in require.cache) {
                if (i.indexOf(__dirname) != -1 && /(source|dist)/.test(i)) {
                    delete require.cache[i]
                }
            }
            require("./source/index.example.js");
        });
    case "build":
        constructor.build();
        break;
}