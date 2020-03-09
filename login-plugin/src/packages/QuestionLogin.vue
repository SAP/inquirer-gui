<template>
  <v-text-field
    ref="login"
    :value="question.answer"
    @input="onInput"
    hide-details="auto"
    type="password"
    outlined
    dense
  >
    <template slot="append">
      <v-tooltip left>
        <template v-slot:activator="{on}">
          <v-icon v-on="on" @click="onLogin">mdi-account-arrow-right-outline</v-icon>
        </template>
        <span>Login</span>
      </v-tooltip>
    </template>
  </v-text-field>
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
    question: Object
  },
  data() {
    return {
      pass: this.question.answer
    };
  },
  methods: {
    afterLogin() {
      // TODO: handle login response
    },
    onLoginReal() {
      // TODO: icon@click
      this.$emit(
        "customEvent",
        this.question.name,
        "doLogin",
        this.afterLogin,
        this.question.answer
      );
    },
    onLogin() {
      // TODO: move to onInput()
      this.$emit("answerChanged", this.question.name, this.pass);
    },
    onInput(value) {
      this.pass = value;
    }
  }
};
</script>
