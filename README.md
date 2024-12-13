# Demo

## Getting Started

### Prerequisites

- Docker
- Node.js (v20)
- npm

### Development Setup

1. Start the PostgreSQL database:

   ```bash
   docker compose up -d
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the values as needed

4. Initialize the database:

   ```bash
   npm run db:reset   # Runs migrations and seeds the database
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

### Additional Notes

- Use `docker compose down` to stop the database container
- The database will be accessible at `localhost:5432` with the credentials in `.env`
- Run `npm run db:studio` to view/edit database content

## Building

To create a production version of your app:

```bash
npm run build
```

## Commands

| Command       | Description                             |
| ------------- | --------------------------------------- |
| `dev`         | Spin up SvelteKit dev server            |
| `build`       | Build for production                    |
| `preview`     | Preview production build                |
| `check:watch` | Run Svelte check in watch mode          |
| `check`       | Run Svelte check                        |
| `commitlint`  | Lint commit messages                    |
| `db:dbml`     | Generate dbml file                      |
| `db:generate` | Generate migrations                     |
| `db:migrate`  | Run migrations                          |
| `db:push`     | Push current schema to database         |
| `db:reset`    | Run migrations and seed database        |
| `db:seed`     | Seed database                           |
| `db:start`    | Run PostgreSQL in a docker container    |
| `db:studio`   | Start Drizzle Studio                    |
| `format`      | Format code                             |
| `lint:fix`    | Lint and fix errors                     |
| `lint`        | Lint code                               |
| `logbook`     | Generate logbook entry                  |
| `prepare`     | Husky                                   |
| `swa:build`   | Build for Azure Static Web Apps         |
| `swa:deploy`  | Deploy to Azure Static Web Apps         |
| `swa:start`   | Start Azure Static Web Apps             |
| `test:e2e`    | Run end-to-end tests with Playwright    |
| `test:e2e:ui` | Run end-to-end tests with Playwright UI |
| `test:unit`   | Run unit tests with Vitest              |
| `test`        | Run all tests                           |
| `translate`   | Translate i18n with Ollama              |

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
