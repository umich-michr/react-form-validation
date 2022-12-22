/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {spawnSync} = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m' // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

const PACKAGE_ENV_KEY = 'INSTALL_PACKAGE_NAME';
const PATH_ENV_KEY = 'INSTALL_PACKAGE_PATH';
const PACKAGE_CMD_ARG_NAME = 'package';
const PATH_COMMAND_ARG_NAME = 'path';
const PACKAGE_ARCHIVE_FILE_PATTERN = 'packageArchiveFilePattern';

function readArgsFromCommandLine() {
  function parseCmdLineArgs(argsIterator, argsObject = {}) {
    const currArg = argsIterator.next();
    if (currArg.done) {
      return {...argsObject};
    }
    const argsArr = currArg.value.split('--')[1]?.split('=');
    const args = argsArr ? {...argsObject, [argsArr[0]]: argsArr[1]} : argsObject;

    return parseCmdLineArgs(argsIterator, args);
  }

  // noinspection JSValidateTypes
  return parseCmdLineArgs(process.argv[Symbol.iterator]());
}

function buildParams() {
  const cmdLineArgs = readArgsFromCommandLine();
  const env = dotenv.config({path: './.env'}).parsed;
  const pkg = cmdLineArgs[PACKAGE_CMD_ARG_NAME] || env[PACKAGE_ENV_KEY];
  return {
    [PACKAGE_CMD_ARG_NAME]: pkg,
    [PATH_COMMAND_ARG_NAME]: cmdLineArgs[PATH_COMMAND_ARG_NAME] || env[PATH_ENV_KEY],
    [PACKAGE_ARCHIVE_FILE_PATTERN]: `${pkg?.replace('/', '-').replace('@', '')}*.tgz`
  };
}

const params = buildParams();
const archiveFile = `${params[PATH_COMMAND_ARG_NAME]}/${params[PACKAGE_ARCHIVE_FILE_PATTERN]}`;

if (!params[PATH_COMMAND_ARG_NAME] || !params[PACKAGE_CMD_ARG_NAME]) {
  console.error(
    colours.bg.red,
    colours.fg.yellow,
    'Incorrect usage of command. Use it similar to below\n' +
      'npm run install:localPackage --path=/Users/vidanda/dev/validation-functions --package=@umich-michr/validation-functions\n' +
      'or specify INSTALL_PACKAGE_NAME and INSTALL_PACKAGE_PATH in .env file',
    colours.reset
  );
  throw new Error('Incorrect usage of command. Required arguments are missing to install the local dependency.');
}

function executeShellCommand(command) {
  console.log(colours.fg.blue, `executing: ${command}`, colours.reset);
  const process = spawnSync(command, {stdio: 'inherit', shell: true});

  if (process.status === 0) {
    console.log(colours.fg.green, `Executed ${command} successfully`, colours.reset);
  } else {
    // noinspection JSCheckFunctionSignatures
    console.error(
      colours.bg.red,
      colours.fg.yellow,
      `Error while trying to uninstall: ${Error(process.stderr)},`,
      colours.reset
    );
  }
  return process.status;
}
function uninstallLocally() {
  executeShellCommand(`npm uninstall ${params[PACKAGE_CMD_ARG_NAME]} -f`);
}
function buildProject() {
  executeShellCommand(`npx shx rm -rf ${archiveFile}`);
  executeShellCommand(`cd ${params[PATH_COMMAND_ARG_NAME]} && npm run package `);
}
function install() {
  executeShellCommand(`npm install ${archiveFile} -f`);
}

buildProject();
uninstallLocally();
install();
