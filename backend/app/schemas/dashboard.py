from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================
# Dashboard Summary
# ==========================================

class DashboardSummary(BaseModel):
    total_predictions: int
    total_diseases: int
    average_confidence: float
    last_prediction: Optional[datetime] = None


# ==========================================
# Recent Predictions
# ==========================================

class RecentPrediction(BaseModel):
    id: str
    disease: str
    prediction: str
    confidence: float
    image_path: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Disease Distribution
# ==========================================

class DiseaseDistribution(BaseModel):
    name: str
    value: int


# ==========================================
# Confidence Trend
# ==========================================

class ConfidenceTrend(BaseModel):
    date: str
    confidence: float