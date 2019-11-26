# Qi Auto Plugin Template

> Other languages / 其他语言:  
> [English](./README.md) | [简体中文](./README.zh_CN.md)  

This repository will help you build plugins of `qi-auto` more easier.

## Features

- Out of the box develop & build environment for `qi-auto` plugins.
- Code bundle based on `Rollup` + `Babel`.
- ESModule supported by `Esm`.
- Unit test based on `Mocha`.

## Usage

### Basic

```
npm i
# Install the dependencies
```

### Command

#### Development

```
npm run dev
# Start the development environment
```

This command will auto (re)build the plugin when the source code files have been modified. And (re)load the `source/index.example.js` automaticly.

#### Build

```
npm run build
# Start to build the whole plugin
```

#### Unit Test

```
npm run test
# Start testing
```

### Template Structure

- **common** - Usefull info and function for this template.
- **constructor** - `Rollup` config and operation of development and build.
- **source** - The source code of your plugin.
- **dist** - The build result of your plugin.
- **test** - (Optional) The test case for your plugin.
- **docs** - (Optional) The detail document of your plugin.
- **example** - (Optional) The example directory structure for demonstrate the usage of your plugin.
- **bootstrap.js** - The entrypoint of this template.
- **manifest.json** - The information of your plugin, using by this template.