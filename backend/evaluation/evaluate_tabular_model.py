from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

from config import DISEASES
from utils import (
    save_confusion_matrix,
    save_metrics_json,
    save_classification_report
)


def evaluate_tabular_model(model_name="anemia"):

    cfg = DISEASES[model_name]

    dataset_path = cfg["dataset"]
    model_path = cfg["model"]
    scaler_path = cfg["scaler"]
    target_column = cfg["target"]

    output_dir = Path("outputs") / model_name
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"\nEvaluating {model_name}")

    df = pd.read_csv(dataset_path)

    X = df.drop(columns=[target_column])
    y = df[target_column]

    scaler = joblib.load(scaler_path)
    model = joblib.load(model_path)

    X_scaled = scaler.transform(X)

    predictions = model.predict(X_scaled)

    accuracy = accuracy_score(y, predictions)

    precision = precision_score(
        y,
        predictions,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y,
        predictions,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y,
        predictions,
        average="weighted",
        zero_division=0
    )

    report = classification_report(
        y,
        predictions,
        zero_division=0
    )

    cm = confusion_matrix(
        y,
        predictions
    )

    metrics = {

        "accuracy": float(accuracy),

        "precision": float(precision),

        "recall": float(recall),

        "f1_score": float(f1)

    }

    save_metrics_json(
        metrics,
        output_dir / "metrics.json"
    )

    save_classification_report(
        report,
        output_dir / "classification_report.txt"
    )

    save_confusion_matrix(
        cm,
        ["Negative", "Positive"],
        output_dir / "confusion_matrix.png",
        title="Anemia"
    )

    print(json.dumps(metrics, indent=4))

    return metrics