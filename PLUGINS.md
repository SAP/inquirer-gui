# Inquirer GUI Plugins

## Overview
Inquirer-gui displays [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) questions in an interactive HTML form.

Inquirer.js prompts users for answers in a command line interface (CLI). The prompts appear different depending on the prompt type.

### Custom Question Types
Inquirer.js ships with 9 built-in question types. In addition, it provides a plugin mechanism for defining custom prompts for custom question types.

Similarly, Inquirer-gui provides a plugin mechanism that enables developers to define custom controls for custom question types.

## Using Plugins
Note that an inquirer-gui plugin is a [Vue.js component](https://vuejs.org/v2/guide/components.html); therefore, your application must be a Vue.js application.

If you prefer to read code, check out the provided [sample app](./sample-app).

If you want to understand what you're doing, keep reading.

### Prerequisites
1. Create a Vue.js application
2. Inside your application, import the Vue.js plugin from inquirer-gui:
    ```js
    import Form from "@sap-devx/inquirer-gui";
    ```
3. Install the `Form` Vue.js plugin:
    ```js
    Vue.use(Form);
    ```
4. Render the `Form`:
    ```html
    <Form ref="form" :questions="questions" @answered="onAnswered" />
    ```
### Registering a Plugin
Import and register the custom control as follows:

* From npm:
    ```js
    import FileBrowserPlugin from "@sap-devx/inquirer-gui-file-browser-plugin";

    let options = {};
    Vue.use(FileBrowserPlugin, options);
    this.$refs.form.registerPlugin(options.plugin);
    ```

* Or directly from your own code:
    ```js
    import QuestionFileBrowser from "./QuestionFileBrowser";

    const plugin = {
        questionType: "file-browser",
        component: QuestionFileBrowser
    };
    this.$refs.form.registerPlugin(plugin);
    ```
### Writing a Question
In order to show a question using a custom control, define a `guiOptions` member with `type` property on your question. For example:
```js
{
    type: "input",
    guiOptions: {
      type: "file-browser",
    },
    name: "configFile",
    message: "Config file",
    default: "/home/",
    getFilePath: async function (currentPath) {
        return await this.showFileBrowserDialog(currentPath);
    }
}
```

## Writing Plugins
Write your custom question type as a Vue.js component that has the following characteristics:

### A question Prop
Your custom component should define a [Vue.js Prop](https://vuejs.org/v2/guide/components-props.html) called `question`:
```js
props: {
  question: Object
}
```
The inquirer-gui framework will bind the relevant question to this prop.

### An answerChanged Event
Your component is expected to emit an `answerChanged` event:
```js
this.$emit("answerChanged", this.question.name, answer);
```

This event should send 2 arguments: the question name and the value of the answer.

You decide when to emit this event; however, note that this event signifies a change in the value of the answer. The inquirer-gui framework listens to this event and then determines whether to invoke specific inquirer.js question methods, such as `when()` and `validate()`.

### Custom Events
[Optional] Custom events enable your custom component to interact with the inquirer.js question. For example, your custom component might display a calendar with holidays. When pressing a button, your component would retrieve the dates of the holidays and then open a date picker. In this example, your component would implement an event listener for the icon's `click` event:
```js
@click="onClick"
```

The `methods` member of your Vue component would implement the `onClick` event listener:
```js
onClick() {
    this.$emit(
        "customEvent",
        this.question.name,
        "getHolidays",
        this.showCalendar,
        "United Kingdom"
    );
}
```

The `customEvent` event expects the following parameters:
* The question name
* The method name of that question
* A callback defined in your custom component that the inquirer-gui framework calls after the question's method returns
* Any number of parameters to the question's method (the one specified in the 2nd parameter)

In the example above, when the user clicks on the calendar icon, the inquirer-gui framework does the equivalent of:
```js
const response = await this.question.getHolidays("United Kingdom");
this.showCalendar(response);
```

You could do the above yourself without emitting the `customEvent` event, but the inquirer-gui framework does some error handling for you. This is especially useful when the question's methods run in the backend, which is the case when running Yeoman generators, for example.
