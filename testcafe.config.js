const createTestCafe = require("testcafe");
const glob = require("glob-promise");
const BrowserStack = require("browserstack");
const chalk = require("chalk");

const SUPPORTED_BROWSERS = [
  [
    "browserstack:edge@81.0:Windows 10",
    "browserstack:chrome@64.0:Windows 10",
    "browserstack:firefox@76.0:Windows 10",
  ],
];

const browserStackCredentials = {
  username: process.env.BROWSERSTACK_USERNAME,
  password: process.env.BROWSERSTACK_ACCESS_KEY,
};

async function getFiles(globPattern) {
  return await glob(globPattern)
    .then((files) => files)
    .catch((e) => console.error(e));
}

async function createTestCafeInstance(browsers, testFiles) {
  let testcafe;
  await createTestCafe()
    .then((tc) => {
      testcafe = tc;
      return tc
        .createRunner()
        .src(testFiles)
        .browsers(browsers)
        .reporter("spec")
        .run();
    })
    .then((failedCount) => {
      console.log("Tests failed: " + failedCount);
      testcafe.close();
    })
    .catch((err) => console.error(err));
}
async function getRunningBrowserstackSessions() {
  const client = BrowserStack.createClient(browserStackCredentials);
  const workerStatus = await new Promise(function (resolve, reject) {
    client.getApiStatus((error, workers) => {
      if (error) reject(error);
      else resolve(workers);
    });
  });
  return workerStatus;
}

async function startTests(browsers, createTestCafeInstance) {
  // The testcafe node api does not accept glob patterns, so grab relevant test files using node-glob
  let files = await getFiles("my-first-test-spec.ts");
  // Check that there are no tests already running
  let sessionInfo = await getRunningBrowserstackSessions();
  if (sessionInfo.running_sessions !== 0) {
    console.error(
      chalk.red(
        "There are not enough available Browserstack workers to run these tests."
      )
    );
  } else {
    // Create a new testcafe instance for each batch of browsers
    for (let i = 0; i < browsers.length; i++) {
      await createTestCafeInstance(browsers[i], files);
    }
  }
}

startTests(SUPPORTED_BROWSERS, createTestCafeInstance);
