from sqlalchemy.orm import Session

from app.models.prediction import Prediction


class ReportService:

    @staticmethod
    def get_reports(
        db: Session,
        user_id: str,
    ):
        """
        Return all reports for the logged-in user.
        """
        return (
            db.query(Prediction)
            .filter(Prediction.user_id == user_id)
            .order_by(Prediction.created_at.desc())
            .all()
        )

    @staticmethod
    def get_report(
        db: Session,
        report_id: str,
        user_id: str,
    ):
        """
        Return a single report belonging to the logged-in user.
        """
        return (
            db.query(Prediction)
            .filter(
                Prediction.id == report_id,
                Prediction.user_id == user_id,
            )
            .first()
        )