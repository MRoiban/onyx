// Mirrors the portable definitions in src/styles/globals.css.
// test/fix2-a-tokens.test.tsx asserts keyframe and animation-class parity.
const keyframes = {
  'onyx-spin': { to: { transform: 'rotate(360deg)' } },
  'onyx-shimmer': {
    from: { backgroundPosition: '200% 0' },
    to: { backgroundPosition: '-200% 0' },
  },
  'onyx-pulse': { '50%': { opacity: '.45' } },
  'onyx-indeterminate': {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(400%)' },
  },
  'onyx-toast-enter': {
    from: { opacity: '0', transform: 'translateY(100%)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'onyx-toast-exit': { to: { opacity: '0', transform: 'translateX(100%)' } },
};
for (const component of ['accordion', 'collapsible']) {
  keyframes[`${component}-open`] = {
    from: { height: '0' },
    to: { height: `var(--radix-${component}-content-height)` },
  };
  keyframes[`${component}-close`] = {
    from: { height: `var(--radix-${component}-content-height)` },
    to: { height: '0' },
  };
}
for (const component of ['accordion', 'collapsible']) {
  keyframes[`${component}-down`] = keyframes[`${component}-open`];
  keyframes[`${component}-up`] = keyframes[`${component}-close`];
}
keyframes['toast-enter'] = keyframes['onyx-toast-enter'];
keyframes['toast-exit'] = keyframes['onyx-toast-exit'];
const animation = Object.fromEntries(
  Object.keys(keyframes).map((name) => [
    name,
    `${name} var(--onyx-duration-normal) var(--onyx-ease-standard)`,
  ]),
);
Object.assign(animation, {
  'onyx-spin': 'onyx-spin var(--onyx-spinner-duration, 700ms) linear infinite',
  'onyx-shimmer': 'onyx-shimmer 1.5s linear infinite',
  'onyx-pulse': 'onyx-pulse 1.5s ease-in-out infinite',
  'onyx-indeterminate': 'onyx-indeterminate 1.5s ease-in-out infinite',
});
module.exports = {
  theme: { extend: { keyframes, animation } },
  get plugins() { return [require('tailwindcss-animate')]; },
};
