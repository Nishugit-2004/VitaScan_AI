from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class RecentPrediction(BaseModel):
    id: str
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True