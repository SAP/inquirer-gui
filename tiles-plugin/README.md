# Tiles Plugin for Inquirer-gui

This plugin presents selectable tiles (cards).

## Installation
```sh
npm install --save @sap-devx/inquirer-gui-tiles-plugin
```

## Usage
* The `guiType` of the Inquirer.js question must be of type `tiles`.
* Each choice of the `choices` member represents a single card.
* Typically, this would be a single question in a prompt. In this case, consider setting the `message` member to an empty string because the prompt's title sufficiently descirbes the question. However, note that if your question is an Inquirer.js question or part of a Yeoman generator and the question is shown in a command-line interface (CLI), the `name` member will be shown instead.

### Sample Question
```json
{
    name: "appType",
    message: "",
    type: "list",
    guiType: "tiles",
    choices: [
    { value: "listReport", name: "List Report", description: "With a list report, ...", homepage: "http://www.sap.com", image: SAP_IMAGE },
    { value: "masterDetail", name: "Master-Detail Application", description: "Create an SAP HANA data model, ..."}
    ]
}
```
