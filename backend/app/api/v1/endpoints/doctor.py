from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.domain import Appointment

router = APIRouter()

@router.get("/appointments")
def get_all_appointments():

    db: Session = SessionLocal()

    appointments = db.query(Appointment).all()

    return appointments