# Contributing Guidelines

### Initial Setup

The initial setup is trivial:

- clone this repo
- `npm i`

### Full Build

To run the full **C**ontinuous **I**ntegration build run `npm run ci` in either the top-level package or a specific subpackage.

### Release Life-Cycle.

This monorepo uses Lerna's [Fixed/Locked][lerna-mode] which means all the sub-packages share the same version number.

[lerna-mode]: https://github.com/lerna/lerna#fixedlocked-mode-default

### Release Process

Release is triggered via a Github Workflow:

- Open [bump versions and tag](https://github.com/SAP/inquirer-gui/actions/workflows/bump-versions-and-tag.yml) Action GUI.
- Click on the `Run workflow` button.
- Choose `automatic` in `semver release type" drop down
  - You can also specify an exact semver bump (patch/minor/major).
- Click on the `Run workflow` button.
- Wait for the workflow to complete.
- Track the newly pushed **tag** (`/^v[0-9]+(\.[0-9]+)*/`) [release build](https://github.com/SAP/inquirer-gui/actions/workflows/release.yml) in Github Actions
- Inspect the newly artifacts published on npmjs.com / Github Releases.

## Report an Issue

To report an issue please use the github issue tracker. Please try to make sure you have these in your issue:

- No duplicate
- Reproducible
- Good summary
- Well-documented
- Minimal example

## Issue handling process

When an issue is reported, a committer will look at it and either confirm it as a real issue (by giving the "in progress" label), close it if it is not an issue, or ask for more details. In-progress issues are then either assigned to a committer in GitHub, reported in our internal issue handling system, or left open as "contribution welcome" for easy or not urgent fixes.

An issue that is about a real bug is closed as soon as the fix is committed.

## Contribute Code

You are welcome to contribute code. PRs will be examined and if it fits the quality requirements and the roadmap of the product they will be merged.

If you contibute a new plugin, please make sure to include it also in sample-app/sample-app-vite. This is a sample application
that includes all plugin and should be maintained for test purposes.

Please be aware to the ongoing Vue3 migration process. More details in the [README.md](README.md) file..

## Commit Messages

This project uses [conventional commits standard](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification) with the [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).
Recommanded: Use `git cz` to build conventional commit messages.

- requires [commitizen](https://github.com/commitizen/cz-cli#installing-the-command-line-tool) to be installed.

## Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).
