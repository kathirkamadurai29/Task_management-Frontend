from sqlalchemy import(Column,Integer,String,Text,DateTime,ForeignKey)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer,primary_key=True)
    title = Column(String(225), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="pending")
    creator_id = Column(Integer,ForeignKey("Users.id"), nullable=False)
    assigned_to = Column(Integer,ForeignKey("Users.id"), nullable=True)
    created_at= Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("User", foreign_keys=[creator_id])
    assignee = relationship("User", foreign_keys=[assigned_to])