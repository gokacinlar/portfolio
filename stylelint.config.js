/** @type {import("stylelint").Config} */

module.exports = {
  extends: ["stylelint-config-standard-scss"],
  defaultSeverity: "warning",
  plugins: [
    "stylelint-scss",
    "stylelint-order",
    "stylelint-no-unsupported-browser-features",
    "stylelint-use-logical"
  ],
  rules: {
    "declaration-no-important": true,
    "no-duplicate-selectors": true,
    "no-descending-specificity": true,
    "declaration-block-no-duplicate-properties": true,
    "property-no-unknown": true,
    "no-unknown-animations": true,
    "length-zero-no-unit": true,
    "shorthand-property-no-redundant-values": true,
    "color-no-hex": true,
    "scss/no-duplicate-mixins": true,
    "scss/no-global-function-names": true,
    "scss/dollar-variable-pattern": "^[a-z][a-z0-9-]*$",
    "csstools/use-logical": true,
    "plugin/no-unsupported-browser-features": [
      true,
      { ignore: ["css-nesting"] }
    ],
    "selector-id-pattern": null,
    "scss/at-mixin-argumentless-call-parentheses": null,
    "color-function-alias-notation": null,
    "order/properties-alphabetical-order": null
  },
  ignoreFiles: [
    "public/**",
    "node_modules/**",
    "vendor/**"
  ]
};
