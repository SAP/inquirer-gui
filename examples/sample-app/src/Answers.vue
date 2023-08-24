<template>
  <div>
    <h1 class="text-success">All answers are valid</h1>
    <ul id="v-for-object">
      <li v-for="(answer, name) in answers" :key="name">
        {{ name }}: {{ answer }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Answers",
  props: {
    answers: Object,
  },
};
</script>
