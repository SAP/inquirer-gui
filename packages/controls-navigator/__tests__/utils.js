export default {
  sleep: function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
