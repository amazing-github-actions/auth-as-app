const github = require('@actions/github');
const { createAppAuth } = require('@octokit/auth-app');
const core = require('@actions/core');

const getAppInstallationAuth = async (owner, appId, privateKey) => {
  try {
    const auth = createAppAuth({ appId, privateKey });

    const appAuth = await auth({ type: 'app' });

    const octokit = github.getOctokit(appAuth.token);

    const { data: app } = await octokit.rest.apps.getAuthenticated();

    let response = undefined;

    if (app.owner.type == 'Organization') {
      response = await octokit.rest.apps.getOrgInstallation({
        org: owner,
      });
    } else {
      response = await octokit.rest.apps.getUserInstallation({
        username: owner,
      });
    }

    const { data: installation } = response;

    core.info(
      `workflow is authenticated as app ${installation.app_slug}, installationId of ${installation.id}`,
    );

    const installationOctokit = await auth({
      installationId: installation.id,
      type: 'installation',
    });

    return installationOctokit.token;
  } catch (error) {
    throw new Error(
      `There was an unexpected error while logging in with GitHub app: ${error.message}`,
    );
  }
};

module.exports = { getAppInstallationAuth };
