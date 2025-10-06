
# Mydea

Mydea is a self-hosted idea board app with draggable "post-it" style notes.  
Drag notes around, edit them, or throw them in the trash to archive.

---

## 🚀 Quickstart

1. Clone this repo
2. Copy the env file and adjust if needed:
   ```bash
   cp .env.example .env
   ```
3. Run with Docker Compose:
   ```bash
   docker compose up -d
   ```

Frontend will be at http://localhost:13245  
Backend API will be at http://localhost:8765

---

## 🛠 Development

### Migrations
To apply migrations:
```bash
docker compose exec backend alembic upgrade head
```

### GHCR Setup
To publish images to GitHub Container Registry:

1. Create a Personal Access Token with `write:packages` scope
2. Add it to repo secrets as `CR_PAT`
3. On push to `main`, images will be published to:
   - `ghcr.io/enduser101/mydea-backend:latest`
   - `ghcr.io/enduser101/mydea-frontend:latest`

---

## 📝 Notes
- No user accounts or auth included (local/self-hosted only).
- Trash pile archives notes instead of deleting them.
- Ordering persists across reloads.

Enjoy 🎉
