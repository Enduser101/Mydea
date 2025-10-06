from sqlalchemy.orm import Session
import models, schemas

def get_idea(db: Session, idea_id: int):
    return db.query(models.Idea).filter(models.Idea.id == idea_id).first()

def get_ideas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Idea).filter(models.Idea.archived == False).order_by(models.Idea.position.asc().nulls_last(), models.Idea.created_at.asc()).offset(skip).limit(limit).all()

def get_archived(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Idea).filter(models.Idea.archived == True).order_by(models.Idea.created_at.desc()).offset(skip).limit(limit).all()

def create_idea(db: Session, idea: schemas.IdeaCreate):
    if idea.position is None:
        max_pos = db.query(models.Idea).filter(models.Idea.archived == False).order_by(models.Idea.position.desc()).first()
        next_pos = (max_pos.position + 1) if (max_pos and max_pos.position is not None) else 1
    else:
        next_pos = idea.position
    db_idea = models.Idea(
        title=idea.title,
        description=idea.description,
        tags=idea.tags,
        custom_fields=idea.custom_fields,
        archived=False,
        position=next_pos
    )
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

def update_idea(db: Session, idea_id: int, payload: schemas.IdeaUpdate):
    db_idea = get_idea(db, idea_id)
    if not db_idea:
        return None
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(db_idea, field, value)
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

def archive_idea(db: Session, idea_id: int):
    db_idea = get_idea(db, idea_id)
    if db_idea:
        db_idea.archived = True
        db.add(db_idea)
        db.commit()
        db.refresh(db_idea)
        return db_idea
    return None
