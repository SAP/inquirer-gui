<template>
  <div class="output-tab-link">
    <a @click="$emit('show-output-tab-link')">View details in the output tab.</a>
  </div>
</template>

<script>
export default {
  name: "OutputTabLink",
  emits: ["show-output-tab-link"],
};
</script>

<style lang="scss">
.output-tab-link {
  padding-top: 4px;

  a {
    color: var(--vscode-textLink-foreground, #3794ff);
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
