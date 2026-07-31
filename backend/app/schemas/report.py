from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ReportResponse(BaseModel):
    id: str
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportDetailResponse(BaseModel):
    id: str
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)