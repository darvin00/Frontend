import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
   
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },
});
