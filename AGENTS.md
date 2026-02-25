# AGENTS.md

## Project Overview

Salesforce DX project ("DemoProject") containing Apex classes, triggers, Lightning Web Components (LWC), and declarative metadata. All runtime services execute on the Salesforce platform — there is no standalone backend, database, or local dev server.

### Key Components

- **Apex**: `QuickAccountController`, `DemoAccountService`, `DemoAccountTriggerHandler`, `AccountBeforeInsert` trigger
- **LWC**: `quickAccountWizard` (account creation form), `deploymentTracker` (CI/CD status + smoke test)
- **Metadata**: Duplicate rules (Account/Contact/Lead), validation rule (Lead.Require_Industry), custom tab

## Cursor Cloud specific instructions

### Prerequisites (installed by update script)

- **Salesforce CLI** (`sf`): installed globally via `npm install --global @salesforce/cli`
- **Node.js dev dependencies**: `npm install` in workspace root installs LWC Jest, ESLint, and related plugins

### Common Commands

| Task | Command |
|---|---|
| Lint LWC JavaScript | `npm run lint` |
| Run LWC unit tests | `npm run test:unit` |
| Run tests with coverage | `npm run test:unit:coverage` |
| Validate project structure | `sf project generate manifest --source-dir force-app --output-dir /tmp` |
| Deploy to org (requires auth) | `sf project deploy start --source-dir force-app --target-org <alias>` |

### Org Authentication

When `SFDX_AUTH_URL` is available as an environment variable, authenticate with:
```
echo "$SFDX_AUTH_URL" > /tmp/auth_url.txt
sf org login sfdx-url --sfdx-url-file /tmp/auth_url.txt --set-default --alias dev-org
rm /tmp/auth_url.txt
```

### Deployment & Smoke Test

Deploy all source: `sf project deploy start --source-dir force-app --target-org dev-org --wait 10`

Smoke test via Apex anonymous (creates a demo Account record):
```
echo 'DemoAccountService.createDemoAccounts(1);' > /tmp/apex.apex
sf apex run --target-org dev-org --file /tmp/apex.apex
```

Verify with SOQL: `sf data query --query "SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 5" --target-org dev-org`

### Important Notes

- **No local dev server**: LWC components render only in a Salesforce org. Local development is limited to Jest unit tests and linting.
- **Deployment requires authentication**: Use `sf org login sfdx-url` with an `SFDX_AUTH_URL` secret or `sf org login web` for interactive login. Without an authenticated org, you cannot deploy or run Apex tests.
- **`.forceignore` excludes `__tests__/`**: LWC Jest test files live under `force-app/**/lwc/**/__tests__/` and are excluded from deployment via `.forceignore`. Without this, deployment fails because test files import `createElement` from `lwc`, which is invalid on the platform.
- **`QuickAccountController` is `@AuraEnabled` only**: It throws `AuraHandledException` and cannot be invoked from anonymous Apex. Use `DemoAccountService.createDemoAccounts()` for CLI-based smoke tests instead.
- **ESLint reports 2 pre-existing issues** in `quickAccountWizard.js` (`no-unused-vars`, `no-else-return`). These are in the existing codebase and not regressions.
- **API Version**: The project targets Salesforce API version 60.0 (see `sfdx-project.json`).
