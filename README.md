
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

---

## 📝 Notes
- No user accounts or auth included (local/self-hosted only).
- Trash pile archives notes instead of deleting them.
- Ordering persists across reloads.

Enjoy 🎉
