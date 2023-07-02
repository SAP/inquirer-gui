<template>
  <div>
    <h1
      class="text-success"
    >All answers are valid</h1>
    <ul id="v-for-object">
      <li
        v-for="(answer, name) in answers"
        :key=name
      >
        {{ name }}: {{ answer }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Answers",
  props: {
    answers: Object
  }
};
</script>
