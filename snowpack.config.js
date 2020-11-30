// Consult https://www.snowpack.dev to learn about these options
module.exports = {
  extends: "@sveltejs/snowpack-config",
  plugins: ["@snowpack/plugin-typescript"],
  mount: {
    src: "/_src",
  },
  alias: {
    $components: "./src/components",
  },
};
