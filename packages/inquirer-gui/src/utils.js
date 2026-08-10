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

export function mountLineHeightPatch(el) {
  if (el && typeof el.updateComplete?.then === "function") {
    el.updateComplete.then(() => applyPatch(el)).catch(() => {});
  } else {
    applyPatch(el); // fallback for non-Lit environments; usually a no-op in tests
  }
}

export default {
  // roughly based on underscore.js:
  //   https://github.com/jashkenas/underscore/blob/1.9.2/underscore.js#L887
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
};
