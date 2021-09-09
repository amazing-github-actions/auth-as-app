# action-auth-as-app

#### a GitHub Action

to get an app installation token

### Inputs

#### `owner`

Specify the GitHub user or organization where the GitHub app is _installed_

- only necessary if it is different than that of the context in which the workflow is running

> default: `${{ github.repository_owner }}`

#### `app_id`

**Required** for authenticating as GitHub app; use: `${{ secrets.TEST_APP_ID }}`

#### `private_key`

**Required** for authenticating as GitHub app; use: `${{ secrets.TEST_PRIVATE_KEY }}`

### Outputs

#### `token`

installation token

---

This Gitub Action allows for a workflow run to be authenticated by a GitHub app instead of a Personal Access Token.

This is useful for the situation in which a token must have both more permissions than the default workflow token provides and access limited to a specific repository.

## Setup

To create a GitHub App useful for this Action:

1. Navigate to [New GitHub App](https://github.com/settings/apps/new)
1. Name your App.
1. Set Homepage URL to something useful
1. In Webhook section, uncheck [√] -> [ ] **Active** - this app isn't listening for native webhooks
1. In Permission section, add the appropriate permissions the subsequent workflow will need. (likely Read on Secrets)
1. _Create GitHub App_
1. Take note of the AppId
1. Follow prompt to create private key and download pem file somewhere safe
1. In the repository where the workflow will run create a secret for each as `<app>_APP_ID` and `<app>_PRIVATE_KEY`

## Usage

Simple workflow configuration using default values.

```
name: A workflow
on:
  workflow_dispatch

jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: amazing-github-actions/auth-as-app@v1.x
        with:
          app_id: ${{ secrets.TEST_APP_ID }}
          private_key: ${{ secrets.TEST_PRIVATE_KEY }}

```
