export default {
  debounce: function (func, wait) {
    var timeout;

    return function executedFunction() {
      var context = this;
      var args = arguments;

      var later = function () {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (!timeout) func.apply(context, args);
    };
  },
  normalizeChoices(choices) {
    if (Array.isArray(choices)) {
      const mappedChoices = choices.map((value) => {
        if (value === undefined || typeof value === "string" || typeof value === "number") {
          return { name: value, value: value };
        } else {
          // eslint-disable-next-line no-prototype-builtins
          if (value.hasOwnProperty("name") && !value.hasOwnProperty("value")) {
            return { name: value.name, value: value.name };
          }
        }
        return value;
      });
      return mappedChoices;
    }
  },
};
