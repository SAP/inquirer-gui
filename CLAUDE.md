# inquirer-gui

A Vue 3 / Vuetify 3 UI component (`@sap-devx/inquirer-gui`) that renders [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)-compliant question arrays as interactive HTML forms. Used in VS Code extensions and browser apps across the SAP BAS tooling stack.

## Architecture

Lerna 9 monorepo with npm workspaces. All packages share a single fixed version (currently `3.4.13`). Source is under `packages/` and `examples/`; no top-level `src/`.

**Core package:**

| Directory | npm name | Role |
|---|---|---|
| `packages/inquirer-gui` | `@sap-devx/inquirer-gui` | The Form component (`Form.vue`), built-in question renderers, plugin system |

**Built-in plugins** (each a separate npm package):

| Directory | npm name | Question type |
|---|---|---|
| `packages/auto-complete-plugin` | `@sap-devx/inquirer-gui-auto-complete-plugin` | `autocomplete` |
| `packages/controls-navigator` | `@sap-devx/controls-navigator` | multi-step navigator UI |
| `packages/file-browser-plugin` | `@sap-devx/inquirer-gui-file-browser-plugin` | `file-browser` |
| `packages/folder-browser-plugin` | `@sap-devx/inquirer-gui-folder-browser-plugin` | `folder-browser` |
| `packages/label-plugin` | `@sap-devx/inquirer-gui-label-plugin` | `label` (read-only) |
| `packages/login-plugin` | `@sap-devx/inquirer-gui-login-plugin` | `login` |
| `packages/radio-button-plugin` | `@sap-devx/inquirer-gui-radio-plugin` | radio button group |
| `packages/single-checkbox-plugin` | `@sap-devx/inquirer-gui-single-checkbox-plugin` | single checkbox |
| `packages/tiles-plugin` | `@sap-devx/inquirer-gui-tiles-plugin` | `tiles` (card grid) |

**Examples** (not published to npm):
- `examples/sample-app` — Vue 3 + webpack demo
- `examples/sample-app-vite` — Vue 3 + Vite demo (primary)
- `examples/sample-navigator` — controls-navigator demo
- `examples/sample-plugin` — how to write a custom plugin
- `examples/sample-vscode-extension` — TypeScript VS Code extension embedding the form as a webview
- `examples/websocket-server` — backend question provider via WebSocket

**Plugin protocol** (see [PLUGINS.md](PLUGINS.md)): a plugin is a Vue component with a `question` prop and emits `answerChanged(name, value)`. Register via `app.use(Plugin, options)` then `form.registerPlugin(options.plugin)`.

## Build

```sh
npm install               # install all workspace dependencies
npm run ci                # format:validate + lint:validate + lerna run ci (all packages)
```

Per-package (inside any `packages/*` or `examples/*` directory):
```sh
npm run build             # vite build → dist/
npm run build-dev         # vite build (dev/watch mode)
npm run ci                # clean + build + test (+ copy-coverage where applicable)
npm run test              # jest tests
```

## Testing

Tests use Jest + `@vue/test-utils`. Test files live under `__tests__/` in each package.

```sh
npm run ci                # full build + tests for all packages (from root)
# or per package:
npm run test
```

Note: `packages/label-plugin` and `packages/tiles-plugin` have no tests.

## CI/CD & Deployment

GitHub Actions (`.github/workflows/`):

- **`ci.yml`** — runs `npm run ci` on Node 20/22/24 for pushes and PRs to `master*` branches.
- **`commitlint.yml`** — enforces conventional commit messages on `master` PRs.
- **`bump-versions-and-tag.yml`** — manual workflow: runs CI, then calls `lerna version` (automatic via conventional commits, or manual patch/minor/major). Pushes a `v*.*.*` tag.
- **`release.yml`** — triggered by `v*.*.*` tags; runs `npm run ci` + `npm run release:publish` (lerna publish from-git) + creates GitHub Release with extracted changelog.

To cut a release:
1. Open [bump-versions-and-tag](https://github.com/SAP/inquirer-gui/actions/workflows/bump-versions-and-tag.yml) → Run workflow → choose `automatic` (or a specific semver bump).
2. GitHub Actions pushes the tag and the release workflow publishes to npm.

Conventional commits enforced via `@commitlint/config-conventional` + husky. Use `git cz` for guided messages.

## Configuration

No runtime environment variables. This is a pure UI library — consumers install `@sap-devx/inquirer-gui` from npm and embed it in their Vue 3 app.

Development requirements:
- Node.js 20+
- npm (not yarn — this repo uses npm workspaces)
