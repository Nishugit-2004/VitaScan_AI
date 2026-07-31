
import os
import shutil
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.ai.router import ai_router
import uuid

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf", ".csv"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

class UploadService:
    def __init__(self):
        self.base_storage = "storage/uploads"

    def validate_file(self, file: UploadFile):
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Unsupported file format.")
        
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)
        
        if size > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")
        return True

    def process_upload(self, db: Session, user_id: str, file: UploadFile, disease_type: str):
        self.validate_file(file)

        target_dir = os.path.join(self.base_storage, disease_type.lower())
        os.makedirs(target_dir, exist_ok=True)

        safe_filename = f"{uuid.uuid4()}_{file.filename}"
        file_path = os.path.join(target_dir, safe_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run AI model
        prediction_result = ai_router.process_and_predict(
            disease_type,
            file_path
        )

        from app.models.prediction import Prediction

        prediction = Prediction(
            user_id=user_id,
            disease=disease_type,
            prediction=prediction_result.get("result_class", "Unknown"),
            confidence=prediction_result.get("confidence_score", 0.0),
            image_path=file_path
        )

        db.add(prediction)
        db.commit()
        db.refresh(prediction)

        return {
            "id": prediction.id,
            "disease": prediction.disease,
            "prediction": prediction.prediction,
            "confidence": prediction.confidence,
            "image_path": prediction.image_path,
            "created_at": prediction.created_at
        }

upload_service = UploadService()
