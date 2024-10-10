import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
    entry: ['bin/bannerlord-helper.ts'],
    format: ['esm'],
    outDir: 'dist',
    target: ['es2015'],
    bundle: true,
    clean: !opts.watch,
    minify: false,
    treeshake: opts.watch ? false : 'smallest',
    sourcemap: !opts.watch,
    splitting: false,
    cjsInterop: true,
    legacyOutput: false,
    dts: true,
    env: {
        ['NODE_ENV']: 'production',
    },
}));
