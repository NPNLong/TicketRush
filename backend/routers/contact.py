from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from services.email_service import send_contact_message

router = APIRouter(prefix="/api/contact", tags=["Contact"])


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    topic: str = Field(..., min_length=1)
    message: str = Field(..., min_length=10, max_length=5000)


@router.post("", status_code=200)
def submit_contact(body: ContactRequest):
    try:
        send_contact_message(
            from_name=body.name.strip(),
            from_email=body.email,
            topic=body.topic,
            message=body.message.strip(),
        )
        return {"success": True, "message": "Đã gửi tin nhắn"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Không thể gửi tin nhắn: {str(e)}"
        )