[![CircleCI](https://circleci.com/gh/SAP/inquirer-gui.svg?style=svg)](https://circleci.com/gh/SAP/inquirer-gui)
[![Coverage Status](https://coveralls.io/repos/github/SAP/inquirer-gui/badge.svg?branch=master)](https://coveralls.io/github/SAP/inquirer-gui?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/SAP/inquirer-gui.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/SAP/inquirer-gui/context:javascript)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![GitHub license](https://img.shields.io/badge/license-Apache_2.0-blue.svg)
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/inquirer-gui)](https://api.reuse.software/info/github.com/SAP/inquirer-gui)
[![dependentbot](https://api.dependabot.com/badges/status?host=github&repo=SAP/inquirer-gui)](https://dependabot.com/)

# Inquirer GUI
![alt text](screenshot.png "Screenshot of sample form")

# Vue3 migration

The `master` branch now supports Vue3 and Vuetify3. 

The `Form` component, builtin plugins and all custom plugins were migrated.
The new versioning is **3.x.y**.

# Vue2 maintenance mode 
We still keep `master-maintenance` branch that is based on Vue2.

Please reserve the use of this branch exclusively for *critical* features or bug fixes.

Since we're still in the process of fully transitioning to Vue3, any changes made here will also need to be contributed to the master branch (Vue3 based). 

When making changes, make sure to increase the version number based on the nature of the change. However, **DO NOT** increase the major version to 3, as that version is specifically reserved for the Vue3 release channel.

## Description
`inquirer-gui` is a UI component that displays [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)-compliant questions in an interactive HTML form.

## Requirements
* [node.js](https://www.npmjs.com/package/node) version 10 or higher.

## Installation and Usage
There are several use-cases for the consuming `inquirer-gui` component:
* You can use it in another Vue application or in a non-Vue application.
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

### Run in Browser - vite based application (Frontend Questions)
Use the provided `sample-app-vite`:
```sh
npm install
cd sample-app-vite
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

### Run as VSCode Extension
Use the provided `sample-vscode-extension`:

```sh
cd sample-vscode-extension
npm install
npm run compile 
npm run copy-dist
```
Open the `sample-vscode-extension` as root folder and in the run configurations choose `Launch Extension`.

If you change the source code of the extension itself you must re-run `npm run compile`.

If changing the webview content don't forget to update the `dist` folder by running `npm run clean-dist && npm run copy-dist`. 

The `copy-dist` script creates the `dist` folder containing the Vue Web application you want to load as webview in a VSCode extension panel and copy it to the extension.


Note that the vscode extension contains example code that loads the index.html, styles and scripts.
In Vue3 using vite based configuration, the bundled code and structure has been changed so this code has to be adjusted accordingly.

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
* The second parameter, `issues`, can be used to, for example, enable or disable a `Next` button.

## Custom form elements
`inquirer-gui` provides *built-in form elements* for all built-in `inquirer.js` question types:
* `list`, `rawlist`
* `expand`
* `checkbox`
* `confirm`
* `input` (number, password and input)
* `editor`

`inquirer-gui` supports *custom form elements* via its `plugin` mechanism (see more [here](PLUGINS.md)).

### Creating a custom form element
A form element plugin is a `javascript` object with this structure:
```js
{
  questionType: '<inquirer-question-type>';
  component: <MyVueComponent>;
}
```

Where `questionType` is the string provided in the question's `type` property, and `component` is a `Vue` component that renders questions of the given type.

There is example of a custom form element in the `/sample-plugin` folder. It is defined as a `Vue plugin` and was published as `@sap-devx/inquirer-gui-date-plugin` on `npm`.

### Consuming a custom form element
Consume a custom form element as a `Vue plugin` using the `app.use()` method. The plugin is returned in the method's `options` parameter. For example, refer to `/sample-app/src/App.vue`:
```js
import DatePlugin from "@sap-devx/inquirer-gui-date-plugin";

const options = {};
// use the Vue plugin
app.use(DatePlugin, options);
// register the inquirer-gui plugin with your form instance
form.registerPlugin(options.plugin);
```
## Release

### Change in the main form element/built in components (under src folder):

1. Your change should include bumping the version of the package.json of "@sap-devx/inquirer-gui" module based on the nature of the change.
2. After your change is merged, go to `releases` in github and click on `Draft a new release`.
3. In `Choose a tag` enter `vx.y.z` - add the `v` prefix to the current version from step (1) and click `Publish release`.  This will automatically trigger the publish script action in circleci and publish this npm module to npmjs.

### Change in custom plugins

1. Your change should include bumping the version of the package.json of "@sap-devx/\<custom-plugin-name\>" module based on the nature of the change.
2. Currently the publish step is done manually via `npm publish` command by an admin user.

## How to obtain support
To get more help, support and information please open a github issue.

## Contributing
Contributing information can be found in the [CONTRIBUTING.md](CONTRIBUTING.md) file.


