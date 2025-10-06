# Mydea v4 - Modern UI release

This release updates the frontend with a modern, vibrant UI inspired by Azure DevOps boards.

## Quickstart (pulling GHCR images)
1. Copy .env.example -> .env and adjust if needed
2. Run:
   ```bash
   docker compose pull
   docker compose up -d
   ```
3. Frontend: http://localhost:13245
   Backend: http://localhost:8765

## To build locally instead of pulling GHCR images
Uncomment the `build:` lines in docker-compose.yml for frontend/backend and run:
```bash
docker compose up --build
```

## Development
Frontend is a Vite + React app in `/frontend`. Backend is FastAPI in `/backend`.

## GHCR CI
A GitHub Actions workflow is included to build and push images to GHCR on push to main. Ensure a repo secret `CR_PAT` with `write:packages` scope exists.
