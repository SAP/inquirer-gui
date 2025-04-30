<template>
  <vscode-textfield
    ref="login"
    @keyup.enter="onLogin"
    @change="onInput"
    :name="question.name"
    :value="question.answer"
    type="password"
  >
    <template slot="content-after">
      <v-tooltip location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" @click="onLogin">mdi-account-arrow-right-outline</v-icon>
        </template>
        <span>Login</span>
      </v-tooltip>
    </template>
  </vscode-textfield>
</template>

<script>
// TODO: separate login from answer
//   @input should fire an answerChanged event
//   icon@click should fire a custom doLogin event
// This enables validating the password upon typing
// It also enables providing specific feedback when actual login fails/succeeds

export default {
  name: "QuestionLogin",
  props: {
    question: Object,
  },
  methods: {
    afterLogin() {
      // TODO: handle login response
    },
    onLoginReal() {
      // TODO: icon@click
      this.$emit("customEvent", this.question.name, "doLogin", this.afterLogin, this.question.answer);
    },
    onLogin() {
      // TODO: move to onInput()
      this.$emit("answerChanged", this.question.name, this.question.answer);
    },
    onInput(value) {
      this.question.answer = value.target.value;
    },
  },
};
</script>
<style>
vscode-textfield {
  width: 100%;
  min-height: 40px;
}
</style>
