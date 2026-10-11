module.exports = {
  presets: [require('./tailwind.preset.cjs')],
  content: ['./src/**/*.{ts,tsx}', '!./src/**/*.test.{ts,tsx}'],
};
