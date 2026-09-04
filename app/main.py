from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
from app.routers.tasks import router as task_router
from app.routers.dashboard import router as dashboard_router
from app.routers.users import router as users_router

app = FastAPI(title="Task Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://task-management-frontend-oz0x.onrender.com",
    ],
    allow_origin_regex=r".*",  # Allows all sites dynamically while supporting credentials
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "Task Management API Running"}

@app.get("/health")
def health_check():
    from app.database.database import SessionLocal
    from sqlalchemy import text
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"database": "connected", "status": "healthy"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}
