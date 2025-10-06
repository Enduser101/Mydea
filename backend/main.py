import os
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, crud, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Mydea API')

@app.get('/')
def root():
    return {'status': 'Mydea backend running'}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/ideas', response_model=list[schemas.Idea])
def read_ideas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ideas(db, skip=skip, limit=limit)

@app.post('/ideas', response_model=schemas.Idea)
def create_idea(idea: schemas.IdeaCreate, db: Session = Depends(get_db)):
    return crud.create_idea(db, idea)

@app.patch('/ideas/{idea_id}', response_model=schemas.Idea)
def patch_idea(idea_id: int, payload: schemas.IdeaUpdate, db: Session = Depends(get_db)):
    db_idea = crud.get_idea(db, idea_id)
    if not db_idea:
        raise HTTPException(status_code=404, detail='Idea not found')
    return crud.update_idea(db, idea_id, payload)

@app.delete('/ideas/{idea_id}')
def archive_idea(idea_id: int, db: Session = Depends(get_db)):
    db_idea = crud.get_idea(db, idea_id)
    if not db_idea:
        raise HTTPException(status_code=404, detail='Idea not found')
    crud.archive_idea(db, idea_id)
    return {'status': 'archived', 'id': idea_id}

@app.get('/archive', response_model=list[schemas.Idea])
def read_archive(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_archived(db, skip=skip, limit=limit)
