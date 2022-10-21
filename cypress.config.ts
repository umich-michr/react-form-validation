/* eslint-disable no-console */
import {defineConfig} from 'cypress';
import {default as find} from 'find-process';
import {default as webpackConfigComponentTests} from './webpack.dev.config.js';
import PluginEvents = Cypress.PluginEvents;
import BeforeRunDetails = Cypress.BeforeRunDetails;
//as of 06/13/2022 react component testing using webpack dev server with https was not working.
// noinspection JSUnresolvedVariable
webpackConfigComponentTests.devServer['server'] = 'http';

function setupNodeEvents(on: PluginEvents /*, config*/) {
  let devServerPID: number;
  on('before:run', (details: BeforeRunDetails) => {
    find('port', 3001).then(function (list) {
      if (!list.length) {
        console.debug('port 3001 is free now');
      } else {
        console.debug('%s is listening port 3001 with PID %s', list[0].name, list[0].pid);
        devServerPID = list[0].pid;
      }
    });
    if (details.specs && details.browser) {
      // details.specs and details.browser will be undefined in interactive mode
      console.debug('Running', details.specs.length, 'specs in', details.browser.name);
    }
  });

  on('after:run', (results: CypressCommandLine.CypressRunResult | CypressCommandLine.CypressFailedRunResult) => {
    if (results) {
      // results will be undefined in interactive mode
      if ('totalPassed' in results) {
        console.debug(results.totalPassed, 'out of', results.totalTests, 'passed');
      }
      process.kill(devServerPID, 'SIGINT');
    }
  });
}

export default defineConfig({
  component: {
    specPattern: 'test/src/cypress/components/*.cy.{ts,tsx}',
    supportFile: 'test/src/cypress/support/component.ts',
    indexHtmlFile: 'test/src/cypress/support/component-index.html',
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: webpackConfigComponentTests
    },
    setupNodeEvents
  }
});
