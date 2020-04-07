function getRollupObject ({
  format
}) {
  return {
    external: ['fs', 'util'],
    input: "src/index.js",
    output: {
      file: `dist/index.${format}.js`,
      format
    }
  };
}

export default [
  getRollupObject({format: 'cjs'}),
  getRollupObject({format: 'esm'})
];
