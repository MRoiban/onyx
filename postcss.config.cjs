const tailwindConfig = require('../new-ui/tailwind.config.cjs');

module.exports = {
  plugins: {
    tailwindcss: tailwindConfig,
    autoprefixer: {}
  }
};
