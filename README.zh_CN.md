# Qi Auto Plugin Template

> Other languages / 其他语言:  
> [English](./README.md) | [简体中文](./README.zh_CN.md)  

该仓库可以帮你更快的构建 `qi-auto` 的插件。

## 功能

- 开箱即用的 `qi-auto` 插件的开发和编译环境。
- 代码打包基于 `Rollup` + `Babel` 。
- ES模块由 `Esm` 提供支持。
- 单元测试基于 `Mocha`。

## 使用方法

### 基础

```
npm i
# 安装依赖
```

### 命令

#### 开发环境

```
npm run dev
# 启动开发环境
```

当源码文件被改变时，这个命令将自动（重新）构建插件。并且自动（重新）加载 `source/index.example.js` 文件。

#### 构建

```
npm run build
# 开始构建整个插件
```

#### 单元测试

```
npm run test
# 开始单元测试
```

### 模板结构

- **common** - 为该模板提供有用的信息和方法
- **constructor** - `Rollup` 的配置和开发及编译操作。
- **source** - 插件源代码。
- **dist** - 插件编译结果。
- **test** - （可选）插件的测试用例。
- **docs** - （可选）你的插件的详细说明文档。
- **example** - （可选）用于演示插件用法的示例目录结构。
- **bootstrap.js** - 该模板的入口文件。
- **manifest.json** - 为该模板提供你的插件的信息。