<template>
  <div>
    <h1 class="text-success">Issues exist</h1>
    <ul id="v-for-object">
      <li v-for="(issue, name) in issues" :key="name">
        {{ name }}: {{ issue }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Issues",
  props: {
    issues: Object,
  },
};
</script>
