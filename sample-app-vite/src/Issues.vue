<template>
  <div>
    <h1
      class="text-success"
    >Issues exist</h1>
    <ul id="v-for-object">
      <li
        v-for="(issue, name) in issues"
        :key=name
      >
        {{ name }}: {{ issue }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Issues",
  props: {
    issues: Object
  }
};
</script>
