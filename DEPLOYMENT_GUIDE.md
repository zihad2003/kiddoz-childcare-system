# KiddoZ Deployment & Operations Guide

## CI/CD Pipeline
- **Continuous Integration (`ci.yml`)**: Runs on every PR/Push to `main`.
  - Installs dependencies.
  - Runs Vitest (Frontend) & Jest (Backend).
  - Builds the production bundle.
- **Continuous Deployment (`cd.yml`)**: Runs on merges to `main`.
  - Deploys frontend to Firebase Hosting.
  - (Planned) Deploy backend to containerized hosting.

## Deployment Strategies

### Unified Deployment (Backend + Frontend)
For the most robust production setup, use the included `Dockerfile`. This build serves the React frontend directly from the Express server, ensuring they are always connected on the same host.
- **Build**: `docker build -t kiddoz-app .`
- **Run**: `docker run -p 5001:5001 --env-file server/.env kiddoz-app`
- **Benefit**: Zero CORS issues and simplified environmental configuration.

### Blue-Green Deployment (Conceptual)
To implement Blue-Green with Docker:
1. Spin up a "Green" version of the container on a new port.
2. Run integration tests (using `/health` and `/ready`) against the Green port.
3. If successful, update the Nginx/Load Balancer to point traffic to the Green port.
4. Keep the "Blue" version for 15 minutes for instant rollback if needed.

### Rollback Mechanisms
- **Frontend**: Use Firebase CLI: `firebase hosting:rollback`.
- **Backend**: Use Docker image tags. Each build in CI should tag with the Git Commit SHA (`docker build -t app:${GITHUB_SHA}`). To rollback: `docker run app:${PREVIOUS_SHA}`.

## Monitoring & Observability

### prometheus + grafana
1. Run `docker-compose up -d`.
2. Access Prometheus at `localhost:9090` to see raw metrics.
3. Access Grafana at `localhost:3001`.
4. Add Prometheus as a Data Source (`http://prometheus:9090`).
5. Import a Node.js dashboard (ID: 11159) to see CPU/Active Handles.

### Application Performance Monitoring (APM)
The server exposes `/metrics` for scraping. For deeper APM (distributed tracing):
- Implement **OpenTelemetry** or use a service like **Datadog** / **New Relic**.
- The current Request ID (`X-Request-Id`) in `server.js` allows correlating logs across asynchronous boundaries.

## MySQL Database Initialization
To satisfy DBMS lab requirements, the system now uses **MySQL**. Follow these steps to initialize your local database:

1. **Create the Database**: 
   Open your MySQL terminal and run:
   ```sql
   CREATE DATABASE kiddoz_db;
   ```
2. **Configure environment**: 
   Ensure your `server/.env` has the correct `DB_USER` and `DB_PASS`.
3. **Run Migrations & Seed**:
   From the `server` directory, run:
   ```bash
   npm run seed
   ```
   *Note: This will automatically create all tables and populate them with sample relational data.*

## Cloudflare Pages Configuration (Frontend)
When deploying the frontend to Cloudflare Pages, you **must** manually set the environment variables in the Cloudflare Dashboard (`Settings > Functions > Environment Variables`) to prevent silent failures.

Required Variables (Prefix with `VITE_`):
- `VITE_API_URL`: The full URL to your production backend (e.g., `https://api.kiddoz.com/api`).
- `VITE_FIREBASE_API_KEY`: Your Firebase Web API Key.
- `VITE_FIREBASE_AUTH_DOMAIN`: `your-project.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID`: `your-project-id`
- `VITE_FIREBASE_STORAGE_BUCKET`: `your-project.appspot.com`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Sender ID.
- `VITE_FIREBASE_APP_ID`: Your App ID.

**Note**: After setting these, you must trigger a new deployment for the changes to take effect in the build.

## Secrets Management
**DO NOT** commit `.env` files.
- **Local**: Use `.env` (ignored by git). See `.env.example` for templates.
- **GitHub Actions**: Add secrets in `Settings > Secrets and variables > Actions`.
- **Docker**: Pass secrets via environment variables in `docker-compose`.
- **Cloudflare**: Set variables in the Pages Dashboard.
