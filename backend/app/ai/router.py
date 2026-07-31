
import logging
from app.ai.preprocessing.processors import (
    DementiaPreprocessor, BreastCancerPreprocessor, 
    MalariaPreprocessor, AnemiaPreprocessor, PreprocessingError
)
from app.ai.models.real_models import (
    DementiaModel, BreastCancerModel, 
    MalariaModel, AnemiaModel, ModelLoadError
)

logger = logging.getLogger(__name__)

class AIModelRouter:
    _instance = None
    
    # Singleton pattern to cache models globally
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIModelRouter, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.routes = {
            "dementia": {
                "preprocessor": DementiaPreprocessor(),
                "model": DementiaModel()
            },
            "breast_cancer": {
                "preprocessor": BreastCancerPreprocessor(),
                "model": BreastCancerModel()
            },
            "malaria": {
                "preprocessor": MalariaPreprocessor(),
                "model": MalariaModel()
            },
            "anemia": {
                "preprocessor": AnemiaPreprocessor(),
                "model": AnemiaModel()
            }
        }
        logger.info("AI Model Router Initialized. Models are ready for lazy loading.")

    def process_and_predict(self, disease_category: str, file_path: str):
        route = self.routes.get(disease_category.lower())
        if not route:
            raise ValueError(f"No AI route defined for category: {disease_category}")
        
        preprocessor = route["preprocessor"]
        model = route["model"]

        try:
            # 1. Preprocessing (Resize, Normalize, Tensor)
            tensor_data = preprocessor.process(file_path)
            
            # 2. Deep Learning Prediction
            prediction = model.predict(tensor_data)
            
            return prediction
        except PreprocessingError as pe:
            logger.error(f"Pipeline error (Preprocessing): {pe}")
            return {"status": "FAILED", "result_class": "Invalid File Format", "confidence_score": 0.0, "processing_time_ms": 0}
        except ModelLoadError as me:
            logger.error(f"Pipeline error (Model Loading): {me}")
            return {"status": "FAILED", "result_class": "Model Load Error", "confidence_score": 0.0, "processing_time_ms": 0}
        except Exception as e:
            logger.error(f"Pipeline unexpected error: {e}")
            return {"status": "FAILED", "result_class": "Inference Error", "confidence_score": 0.0, "processing_time_ms": 0}

ai_router = AIModelRouter()
