/* eslint-disable no-console */
import {defineConfig} from 'cypress';
import find from 'find-process';
import webpackConfigComponentTests from './webpack.dev.config.js';
import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import PluginEvents = Cypress.PluginEvents;
import BeforeRunDetails = Cypress.BeforeRunDetails;
import PluginConfigOptions = Cypress.PluginConfigOptions;
//as of 06/13/2022 react component testing using webpack dev server with https was not working.
// noinspection JSUnresolvedVariable
webpackConfigComponentTests.devServer['server'] = 'http';

function setupNodeEvents(on: PluginEvents, config: PluginConfigOptions) {
  registerCodeCoverageTasks(on, config);
  let devServerPID: number;
  on('before:run', (details: BeforeRunDetails) => {
    find('port', webpackConfigComponentTests.devServer.port).then(function (list) {
      if (!list.length) {
        console.debug(`port ${webpackConfigComponentTests.devServer.port} is free now`);
      } else {
        console.debug(
          `%s is listening port ${webpackConfigComponentTests.devServer.port} with PID %s`,
          list[0].name,
          list[0].pid
        );
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
  return config;
}

export default defineConfig({
  downloadsFolder: 'build/cypress/downloads',
  fixturesFolder: 'test/src/cypress/fixtures',
  screenshotsFolder: 'build/cypress/screenshots',
  videosFolder: 'build/cypress/videos',
  env: {
    coverage: true,
    codeCoverage: {
      exclude: ['test/**/*.*']
    }
  },
  video: false,
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
