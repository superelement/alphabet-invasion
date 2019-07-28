import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: {
    file: 'public/index.bundle.js',
    format: 'iife',
    name: 'mainBundle'
  },
  plugins: [
    typescript(),
    resolve()
  ]
}