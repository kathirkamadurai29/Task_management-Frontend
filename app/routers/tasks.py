from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.dependencies.auth import get_current_user
from app.models.user import User


def build_task_response(task: Task) -> dict:
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "creator_id": task.creator_id,
        "creator_username": task.creator.username if task.creator else None,
        "assigned_to": task.assigned_to,
        "assigned_to_username": task.assignee.username if task.assignee else None,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }



router = APIRouter(
    prefix = "/tasks", tags=["Tasks"]
)

@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if task.assigned_to is not None:
        assigned_user = db.query(User).filter(User.id == task.assigned_to).first()
        if not assigned_user:
            raise HTTPException(status_code=404, detail="Assigned user not found")

    new_task = Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        creator_id=current_user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)



    return {
        "message": "Task created Succesfully",
        "task_id": new_task.id,
    }

@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = db.query(Task).filter(
        Task.creator_id == current_user.id).all()

    return [build_task_response(t) for t in tasks]
    

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this task")

    return build_task_response(task)

@router.put("/{task_id}")
def update_task(
    task_id: int,
    updated_task: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    if updated_task.title is not None:
        task.title = updated_task.title

    if updated_task.description is not None:
        task.description = updated_task.description

    if updated_task.status is not None:
        task.status = updated_task.status

    if updated_task.assigned_to is not None:
        assigned_user = db.query(User).filter(User.id == updated_task.assigned_to).first()
        if not assigned_user:
            raise HTTPException(status_code=404, detail="Assigned user not found")
        task.assigned_to = updated_task.assigned_to

    db.commit()
    db.refresh(task)

    return {"message": "Task Updated Successfully"}


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted Successfully"}