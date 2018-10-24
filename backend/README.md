# Decision Maker - Backend

The backend of Decision Maker is an Express app, using [TypeORM](http://typeorm.io/) to interact with a SQL database.

## Entrypoint
`src/server.ts` is where I set up a class wrapping an Express server, which gets instantiated in `src/index.ts` and test files.

## Database configuration
`ormconfig.js` contains three sets of configurations; `test` uses an in-memory SQLite database for running automated tests, `local` connects to a locally-hosted MySQL database for manual testing during development, and `docker` connects to a remote MySQL database, loading configuration from environment variables.

## Frontend files
The Express server is responsible for serving the compiled & bundled frontend files as well, using the `frontend-files` link. To avoid cross-origin issues, the frontend files are on the same domain.

## URL structure
The API is served with `/api/(version number)/` as the root (i.e. `/api/v0.1/`).