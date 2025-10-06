from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Idea(Base):
    __tablename__ = 'ideas'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text, default='')
    tags = Column(JSON, default=[])
    custom_fields = Column(JSON, default={})
    archived = Column(Boolean, default=False)
    position = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
