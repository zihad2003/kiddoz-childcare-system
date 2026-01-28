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

## Secrets Management
**DO NOT** commit `.env` files.
- **Local**: Use `.env` (ignored by git).
- **GitHub Actions**: Add secrets in `Settings > Secrets and variables > Actions`.
  - `FIREBASE_SERVICE_ACCOUNT_KIDDOZ`
  - `GEMINI_API_KEY`
  - `JWT_SECRET`
- **Docker**: Pass secrets via environment variables in `docker-compose`.
