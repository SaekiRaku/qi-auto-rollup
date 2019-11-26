# Qi Auto Rollup

> Other languages / 其他语言:  
> [English](./README.md) | [简体中文](./README.zh_CN.md) 

## 概述

一个自动生成 `rollup` 配置的 `qi-auto` 插件。推荐用于开发类库项目。

## 快速上手

假设你要开发一个有如下目录结构的类库：

```
./source
├── Common
│   ├── a.js
│   ├── b.js
│   ├── c.js
│   └── index.js
├── Main
│   ├── index.js
│   └── ...js
└── entrypoint.js
```

在大多数情况下，`rollup` 可以非常完美地处理。但是，如果您想同时构建 `umd` 和 `esm`（用于 Tree Shaking 优化）模块，你必须再添加 `rollup` 配置。但是，如果我们使用 `qi-auto-rollup`，这项工作将变得更加容易。

```javascript
import qiauto from "@qiqi1996/qi-auto";

const auto = new qiauto({
    "bundler": {
        module: `qi-auto-rollup`,
        directory: "/path/to/source",
        filter: /entrypoint\.js/,
        options: {
            name: "LibraryName.js",
            output: "/path/to/dist",
            format: ["cjs", "esm"]
        }
    }
})

auto["bundler"].build();
```

或者，如果您正在构建UI组件库（例如`antd`），并且希望在某些不支持 Tree Shaking 优化的打包器上也能支持按需加载。您必须单独打包每个组件才能做到这一点。为 `rollup` 编写如此多的配置是一件艰巨的工作。

让我们看看用 `qi-auto-rollup` 是如何处理的：[暂未完成](./)

## 配置

### options.name

> 类型：String | Function  

指明输出文件应使用的名称。一些特殊字符串将根据下面的描述动态替换：

- [folder] - 文件所在的文件夹的名称
- [name] - 文件名称
- [ext] - 文件后缀名

例如：如果将 qi-[folder] 应用于 about/index.js 文件，则会返回 qi-about。

如果提供了函数，则将把每个文件的绝对路径传入该函数。(`{ filepath: "/absolute/path/for/each/files" }`)。


### options.output

> 类型：String | Funciton  

指示打包结果文件输出的目录。

如果提供了函数，则将把每个文件的绝对路径传入该函数。(`{ filepath: "/absolute/path/for/each/files" }`)。

### options.format

> 类型：String | Array  

指示应使用哪种模块类型进行打包。

如果提供了函数，则将把每个文件的绝对路径传入该函数。(`{ filepath: "/absolute/path/for/each/files" }`)。

### options.inputConfig

> 类型：Object | Function  
> 可选的

该对象将合并到 `rollup` 的每个输入配置。

如果提供了函数，则将把每个文件的绝对路径传入该函数。(`{ filepath: "/absolute/path/for/each/files" }`)。

### options.outputConfig

> 类型：Object | Function  
> 可选的

该对象将合并到 `rollup` 的每个输出配置。

如果提供了函数，则将把每个文件的绝对路径传入该函数。(`{ filepath: "/absolute/path/for/each/files" }`)。

## 返回值

您将获得一个具有以下属性的对象作为返回值。

### config

生成的 `rollup` 的所有配置。结构是这样的：

```javascript
{
    "/path/to/each/files": {
        input: [ rollupInputConfig, rollupInputConfig, ... ],
        output: [ rollupOutputConfig, rollupOutputConfig, ... ],
    },
    "...": { input, output }
    ...
}
```

### build(rollup.rollup, callback)

使用生成的配置构建整个程序包。请为第一个参数提供 `rollup.rollup` 。当构建过程出错或完成时，将调用回调。举个栗子：

```javascript
import { rollup } from "rollup";

let auto = new qiauto({ ... });

auto["..."].build(rollup, evt=>{
    evt.error // 构建过程是否出错
    evt.message // 涉及的文件
    evt.data // 详细的错误信息
})
```

### watch(rollup.watch, callback)

使用生成的配置启动开发环境。请提供 `rollup.watch` 作为第一个参数。当 `rollup watcher` 产生事件时，将调用回调。

```javascript
import { watch } from "rollup";

let auto = new qiauto({ ... });

auto["..."].watch(watch, evt=>{
    evt.error // 构建过程是否出错
    evt.message // 涉及的文件
    evt.data // rollup wather 的事件对象，详见：http://rollupjs.org/guide/en/#rollupwatch
})
```

### stop()

停止所有 rollup watcher。