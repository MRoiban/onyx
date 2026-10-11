import page from './index.html';
const server = Bun.serve({
  port: 4816,
  routes: { '/': page },
  development: true,
});
// Tailwind watch keeps later workstream changes visible without restarting.
const watcher = Bun.spawn(
  [
    'bunx',
    'tailwindcss',
    '-c',
    'tailwind.config.cjs',
    '-i',
    'src/styles.css',
    '-o',
    'gallery/onyx.css',
    '--watch',
  ],
  { stdout: 'inherit', stderr: 'inherit' },
);
process.on('exit', () => watcher.kill());
console.log(`Onyx gallery: ${server.url}`);
