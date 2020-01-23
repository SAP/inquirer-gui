![GitHub license](https://img.shields.io/badge/license-Apache_2.0-blue.svg)

# Inquirer GUI
![alt text](screenshot.png "Screenshot of sample form")

## Description
`inquirer-gui` is a UI component that displays [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)-compliant questions in an interactive HTML form.

## Requirements
* [node.js](https://www.npmjs.com/package/node) version 10 or higher.

## Installation and Usage
There are several use-cases for the consuming `inquirer-gui` component:
* You can use it in another Vue application or in a non-Vue application
* You can use it in a browser or in Visual Studio Code
* You can provide the questions in the frontend or in the backend (providing questions in the backend implies more flexibility in composing questions)

We provide examples for some of the above use-cases.

First, clone this directory:
```sh
git clone https://github.com/SAP/inquirer-gui
```

### Run in Browser (Frontend Questions)
Use the provided `sample-app`:
```sh
npm install
cd sample-app
npm install
npm run serve
```
This will run the web server on `localhost` on an available port. Open the provided link in the browser.
### Run in Browser (Backend Questions)
Use the provided `sample-app` and `websocket-server`:
```sh
npm install
cd websocket-server
npm install
```
If using Visual Studio Code, run the `WebSocket Server` debug configuration. This will start the sample WebSocket server that listens for requests on port `8081`.
```sh
cd sample-app
npm install
npm run serve
```
This will run the web server on `localhost` on an available port. Open the provided link in the browser.

### Usage
If writing a Vue application, simply add the following line to your `<template>` tag:
```html
   <Form ref="form" :questions="questions" @answered="onAnswered" />
```

The `questions` property is an [inquirer.js-compliant](https://github.com/SBoudrias/Inquirer.js/#questions) array of questions. E.g.:
```js
[
  {
    type: "input",
    name: "name",
    message: "Your name (frontend)",
    default: "Joe",
    validate: function (input) {
      if (input.length >= 2) {
        return true;
      } else {
            return "Name must be at least 2 characters long";
      }
    }
  }
]
```

The `answered` event is fired when any answer is changed:
* The first parameter to the event handler, `answers`, contains all answers.
* The second parameter, `allValid`, can be used to, for example, enable or disable a `Next` button.

## Note
The samples provided consume the `inquirer-gui` component directly from source code.

In real life scenarios, the component should be consumed from `npm`:

* Run this shell command:
```sh
npm install @sap-devx/inquirer-gui --save
```
* In the source code replace instances of `import Form from ...` with:
```js
import Form from "@sap-devx/inquirer-gui/dist/form.umd";
```

## How to obtain support
To get more help, support and information please open a github issue.

## Contributing
Contributing information can be found in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License
Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, v. 2 except as noted otherwise in the [LICENSE]() file.