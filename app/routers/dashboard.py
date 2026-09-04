from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.models.task import Task

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def dashboard_summary(
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_tasks = db.query(Task).count()
    pending_tasks = db.query(Task).filter(
        Task.status == "pending"
    ).count()
    in_progress_tasks = db.query(Task).filter(
        Task.status == "in progress"
    ).count()
    completed_tasks = db.query(Task).filter(
        Task.status == "completed"
    ).count()
    return {
        "total_users": total_users, "total_tasks": total_tasks,"pending_tasks": pending_tasks,"in_progress_tasks": in_progress_tasks,"completed_tasks": completed_tasks
    }