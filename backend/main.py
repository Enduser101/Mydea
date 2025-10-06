
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, database
from pydantic import BaseModel
from typing import Optional

database.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

class IdeaSchema(BaseModel):
    title: str
    description: Optional[str] = None
    tags: Optional[str] = None
    custom_fields: Optional[dict] = {}
    archived: Optional[bool] = False
    position: Optional[int] = 0

    class Config:
        orm_mode = True

@app.post("/ideas")
def create_idea(idea: IdeaSchema, db: Session = Depends(database.SessionLocal)):
    db_idea = models.Idea(**idea.dict())
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@app.get("/ideas")
def list_ideas(db: Session = Depends(database.SessionLocal)):
    return db.query(models.Idea).filter(models.Idea.archived == False).order_by(models.Idea.position, models.Idea.created_at).all()

@app.patch("/ideas/{idea_id}")
def update_idea(idea_id: int, idea: dict, db: Session = Depends(database.SessionLocal)):
    db_idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not db_idea:
        return {"error": "Not found"}
    for key, value in idea.items():
        setattr(db_idea, key, value)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@app.get("/archive")
def list_archived(db: Session = Depends(database.SessionLocal)):
    return db.query(models.Idea).filter(models.Idea.archived == True).all()
