# Kreacon

## For Mattias

Hi!

It's probably easier to just use the deployed version of the app, a bit of a hassle to get everything set up with Azure.
As for ticket you can use any `UUID` to get a ticket from the external api (`crypto.randomUUID()` works great for generating a ticket number).

## Getting Started

### Prerequisites

- Docker
- Node.js (v20)
- npm
- nvm (optional, for switching Node versions)

### Development Setup

1. Make sure you are using Node 20:

   ```bash
   nvm use 20 # optional, if you have nvm installed
   node --version
   ```

2. Start the PostgreSQL database:

   ```bash
   docker compose up -d
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
     - `cp .env.example .env`
   - Update the values as needed

5. Initialize the database:

   ```bash
   npm run db:reset # Runs migrations and seeds the database
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser

### Additional Notes

- Use `docker compose down` to stop the database container
- The database will be accessible at `localhost:5432` with the credentials in `.env`
- Run `npm run db:studio` to view/edit database content
- You need to create OAuth apps for Discord and Github if you want to use them
  - [Create Discord OAuth app](https://discord.com/developers/applications)
  - [Create Github OAuth app](https://github.com/settings/applications/new)
- You need to create an Azure Storage account and set the `AZURE_STORAGE_ACCOUNT_KEY` in `.env`
  - [Create Azure Storage Account](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM)

## Building

To create a production version of your app:

```bash
npm run build
```

## Commands

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `dev`            | Spin up SvelteKit dev server            |
| `build`          | Build for production                    |
| `preview`        | Preview production build                |
| `check:watch`    | Run Svelte check in watch mode          |
| `check`          | Run Svelte check                        |
| `commitlint`     | Lint commit messages                    |
| `db:dbml`        | Generate dbml file                      |
| `db:generate`    | Generate migrations                     |
| `db:migrate`     | Run migrations                          |
| `db:push`        | Push current schema to database         |
| `db:reset`       | Run migrations and seed database        |
| `db:seed`        | Seed database                           |
| `db:start`       | Run PostgreSQL in a docker container    |
| `db:studio`      | Start Drizzle Studio                    |
| `format`         | Format code                             |
| `lint:fix`       | Lint and fix errors                     |
| `lint`           | Lint code                               |
| `logbook`        | Generate logbook entry                  |
| `prepare`        | Husky                                   |
| `swa:build`      | Build for Azure Static Web Apps         |
| `swa:deploy`     | Deploy to Azure Static Web Apps         |
| `swa:start`      | Start Azure Static Web Apps             |
| `test:e2e`       | Run end-to-end tests with Playwright    |
| `test:e2e:ui`    | Run end-to-end tests with Playwright UI |
| `test:unit`      | Run unit tests with Vitest              |
| `test`           | Run all tests                           |
| `i18n:translate` | Translate i18n with Ollama              |
| `i18n:check`     | Check i18n coverage                     |

## Environment variables

### .env

```
BASE_URL=http://localhost:5173
DATABASE_URL=postgresql://root:mysecretpassword@localhost:5432/kreacon
DB_HOST=localhost
DB_NAME=kreacon
DB_PASSWORD=mysecretpassword
DB_PORT=5432
DB_USER=root
NODE_ENV=development
OAUTH_DISCORD_CLIENT_ID=<discord-client-id>
OAUTH_DISCORD_CLIENT_SECRET=<discord-client-secret>
OAUTH_DISCORD_REDIRECT_URI=<discord-redirect-uri>
OAUTH_GITHUB_CLIENT_ID=<github-client-id>
OAUTH_GITHUB_CLIENT_SECRET=<github-client-secret>
OAUTH_GITHUB_REDIRECT_URI=<github-redirect-uri>
TICKET_API_URL=<ticket-api-url>
BODY_SIZE_LIMIT=10485760
AZURE_STORAGE_ACCOUNT_NAME=<azure-storage-account-name>
AZURE_STORAGE_ACCOUNT_KEY=<azure-storage-account-key>
```

### .env.test.local

Same as `.env` but can use local database.

```
...
NODE_ENV=test
DATABASE_URL=postgresql://root:mysecretpassword@localhost:5432/test
```

### .env.test

Used for CI/CD. Include these additional variables and update to use your hosted test database:

```
NODE_ENV=test
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/test
AZURE_POSTGRESQL_SERVER_NAME=<server-name-without-domain>
AZURE_POSTGRESQL_RESOURCE_GROUP=<resource-group>
```

### .env.production

Used when deploying to production. Update the following variables to use your hosted database and production settings:

```
NODE_ENV=production
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<database>
BASE_URL=https://your-production-domain.com
AZURE_POSTGRESQL_SERVER_NAME=<server-name>
AZURE_POSTGRESQL_RESOURCE_GROUP=<resource-group>

# OAuth settings (update with production URLs)
OAUTH_DISCORD_REDIRECT_URI=https://your-production-domain.com/auth/discord/callback
OAUTH_GITHUB_REDIRECT_URI=https://your-production-domain.com/auth/github/callback
```

## TODO

- [ ] Remove `For Mattias` from the README

### Profile

- [ ] Fix bug where user gets logged out randomly
- [ ] Update profile page after adding ticket

### Entries

#### Create entry

- [ ] Show add ticket form if user has no tickets

### Admin

- [ ] Disallow change of submission and voting dates if already in progress
- [ ] Add custom field: User status
- [ ] Add custom field: User role
- [ ] Show number of votes per entry
