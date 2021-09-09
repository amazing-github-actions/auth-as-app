const core = require('@actions/core');
const isBase64 = require('is-base64');
const { getAppInstallationAuth } = require('./lib');

async function run() {
  try {
    const owner = core.getInput('owner', { required: true });

    const appId = core.getInput('app_id', { required: true });
    const privateKeyInput = core.getInput('private_key', { required: true });

    const privateKey = isBase64(privateKeyInput)
      ? Buffer.from(privateKeyInput, 'base64').toString('utf8')
      : privateKeyInput;

    core.setOutput(
      'token',
      await getAppInstallationAuth(owner, appId, privateKey),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

/* istanbul ignore next */
if (require.main === module) {
  run();
} else {
  module.exports = { run };
}
