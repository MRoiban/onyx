await Bun.write(
  'gallery/codicon.ttf',
  Bun.file('node_modules/@vscode/codicons/dist/codicon.ttf'),
);

export {};
