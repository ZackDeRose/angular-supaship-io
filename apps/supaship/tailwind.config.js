const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: ['sofia-pro', 'sans-serif'],
      display: ['cubano', 'sans-serif'],
      body: ['sofia-pro', 'sans-serif'],
      code: ['attribute-mono', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
