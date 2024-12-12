# Demo

## Developing

docker compose up

Once you've created a project and installed dependencies with `npm install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

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
