from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PredictionCreate(BaseModel):
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str] = None


class PredictionResponse(BaseModel):
    id: str
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True