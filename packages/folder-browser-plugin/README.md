# Folder Browser Plugin for Inquirer-gui

This inquirer-gui plugin enables selecting a folder from a backend.

![Inquirer-gui Folder-Browser](./folder-browser.png)

It can be used in Visual Studio Code when working locally or in [remote development](https://code.visualstudio.com/docs/remote/remote-overview) or in [Theia](https://github.com/eclipse-theia/theia).

See the [sample-vscode-extension](https://github.com/SAP/inquirer-gui/tree/master/sample-vscode-extension) for useage.

### Sample Question

```js
      {
        type: "input",
        guiOptions: {
              type: "folder-browser",
        },
        name: "dump",
        message: "Choose dump folder",
        default: "/",
        getPath: async function (currentPath) {
              return `${currentPath}subfolder/`;
        }
      },
```
