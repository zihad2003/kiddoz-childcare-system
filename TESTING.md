# Testing Strategy

## Overview
This project uses a split testing strategy for the Frontend (React/Vite) and Backend (Node/Express).

## Frontend Testing
- **Framework**: Vitest (Unit & Integration) + React Testing Library (Component Testing)
- **Location**: `src/test/` and alongside components.
- **Run Tests**: `npm run test:frontend`
- **Key Tests**:
  - `Chatbot.test.jsx`: Verifies the AI Chatbot UI, opening logic, and mock API interaction.

## Backend Testing
- **Framework**: Jest (Unit & Integration) + Supertest (API Testing)
- **Location**: `server/tests/`
- **Run Tests**: `npm run test:backend`
- **Key Tests**:
  - `unit/appError.test.js`: Verifies custom error class logic.
  - `integration/health.test.js`: Verifies API health and readiness probes.

## Running All Tests
To run all frontend tests:
```bash
npm test
```

To run backend tests:
```bash
cd server
npm test
```

## Future Test Coverage Plan
- **E2E**: Implement Cypress or Playwright for full user flows (Login -> specific dashboard -> Logout).
- **Load Testing**: Use k6 for API load testing on `/api/ai`.
- **Security**: Integrate OWASP ZAP scans in CI/CD.
