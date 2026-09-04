from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database.database import Base
class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True)
    email = Column(String(50), unique=True, nullable = False)
    username = Column(String(50), nullable = False)
    created_at = Column(DateTime, default=datetime.utcnow)
    password_hash = Column(String(225), nullable = False)