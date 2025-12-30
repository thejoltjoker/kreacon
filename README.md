# Kreacon

## Getting Started

### Prerequisites

- Docker
- Node.js (v24)
- npm
- nvm (optional, for switching Node versions)

### Development Setup

1. Make sure you are using Node 24:

   ```bash
   nvm use 24 # optional, if you have nvm installed
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

### Azure Storage Setup

After creating your Azure Storage account, you need to configure it properly:

1. **Get your credentials** from Azure Portal:
   - Navigate to: Storage accounts → [Your Account] → Access keys
   - Copy the **Storage account name** and **key1** or **key2**
   - Add them to `.env` (without quotes):
     ```
     AZURE_STORAGE_ACCOUNT_NAME=youraccount
     AZURE_STORAGE_ACCOUNT_KEY=your-key-here
     ```

2. **Configure network access**:
   - Go to: Storage accounts → [Your Account] → Networking
   - Under "Firewall and virtual networks":
     - Add your development machine's IP address, or
     - Select "Enabled from all networks" (less secure, only for development)
   - Click "Save"

3. **Configure CORS** to allow uploads from your app:

   > **Security Note:** Do **not** pass your Azure Storage credentials (`--account-key`, `--account-name`) directly as command-line arguments, as this exposes them in shell history and process lists. Use Azure CLI authentication or environment variables instead.

   # Option 1: Use Azure CLI authentication (recommended)

   az login
   az storage cors add \
    --services b \
    --methods DELETE GET HEAD MERGE OPTIONS POST PUT PATCH \
    --origins "http://localhost:5173" \
    --allowed-headers "_" \
    --exposed-headers "_" \
    --max-age 3600

   # Option 2: Use environment variables (if you need to use a key)

   export AZURE*STORAGE_ACCOUNT="youraccount"
   export AZURE_STORAGE_KEY="your-key-here"
   az storage cors add \
    --services b \
    --methods DELETE GET HEAD MERGE OPTIONS POST PUT PATCH \
    --origins "http://localhost:5173" \
    --allowed-headers "*" \
    --exposed-headers "\_" \
    --max-age 3600

   # For production, change the origin:

   az storage cors add \
    --services b \
    --methods DELETE GET HEAD MERGE OPTIONS POST PUT PATCH \
    --origins "https://your-domain.com" \
    --allowed-headers "_" \
    --exposed-headers "_" \
    --max-age 3600

4. **Create required containers**:

   ```bash
   npm run setup:azure
   # Or manually: npx tsx src/lib/helpers/createContainers.ts
   ```

   This will create the following containers with public blob access:
   - `uploads` - Main upload container
   - `previews` - Preview images
   - `thumbnails` - Thumbnail images
   - `avatars` - User avatars
   - `video-entries` - Video submissions
   - `image-entries` - Image submissions
   - `audio-entries` - Audio submissions

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
| `setup:azure`    | Create Azure Storage containers         |
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
PUBLIC_BASE_URL=localhost:5173
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
PUBLIC_SENTRY_DSN=<your-sentry-dsn>
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
PUBLIC_BASE_URL=your-production-domain.com
AZURE_POSTGRESQL_SERVER_NAME=<server-name>
AZURE_POSTGRESQL_RESOURCE_GROUP=<resource-group>

# OAuth settings (update with production URLs)
OAUTH_DISCORD_REDIRECT_URI=https://your-production-domain.com/auth/discord/callback
OAUTH_GITHUB_REDIRECT_URI=https://your-production-domain.com/auth/github/callback
```

## TODO

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
