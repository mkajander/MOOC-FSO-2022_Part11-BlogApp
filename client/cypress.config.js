// eslint-disable-next-line no-undef
const { defineConfig } = require("cypress");

// eslint-disable-next-line no-undef
module.exports = defineConfig({
  e2e: {
    timeout: 30000,
    supportFile: false,
    // eslint-disable-next-line no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
