<template>
  <vscode-textfield
    ref="textfield"
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
// @vscode-elements/elements@1.11.0 hardcodes line-height: 18px on the inner
// <input> with no CSS custom property hook. Remove this patch when the library
// exposes one (e.g. --vscode-input-line-height).
function applyPatch(el) {
  if (el && el.shadowRoot && !el.shadowRoot.querySelector("style.line-height-patch")) {
    const style = document.createElement("style");
    style.className = "line-height-patch";
    // !important needed to override the library's hardcoded constructed stylesheet
    style.textContent = "input { line-height: normal !important; }";
    el.shadowRoot.appendChild(style);
  }
}

function mountLineHeightPatch(el) {
  if (el && typeof el.updateComplete !== "undefined") {
    el.updateComplete.then(() => applyPatch(el));
  } else {
    applyPatch(el); // fallback for non-Lit environments; usually a no-op in tests
  }
}

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
  mounted() {
    mountLineHeightPatch(this.$refs.textfield);
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
