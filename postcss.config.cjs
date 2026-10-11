module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')({ config: './tailwind.config.cjs' }),
    require('autoprefixer'),
  ],
};
