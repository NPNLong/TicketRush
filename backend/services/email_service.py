# """
# Email service - gửi mail qua SMTP (Gmail hoặc bất kỳ provider nào).

# Cấu hình trong backend/.env:
#   SMTP_HOST=smtp.gmail.com
#   SMTP_PORT=587
#   SMTP_USER=your@gmail.com
#   SMTP_PASSWORD=your-app-password   # Gmail: tạo App Password tại myaccount.google.com/apppasswords
#   SMTP_FROM=TicketRush <your@gmail.com>
#   FRONTEND_URL=http://localhost:5173
# """
# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# from core.config import settings


# def _send(to: str, subject: str, html: str) -> None:
#     """Gửi email qua SMTP/TLS. Ở dev mode log ra console nếu SMTP chưa cấu hình."""
#     if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
#         if settings.APP_ENV == "development":
#             print(f"\n{'='*60}")
#             print(f"[DEV EMAIL] To: {to}")
#             print(f"[DEV EMAIL] Subject: {subject}")
#             print(f"[DEV EMAIL] (SMTP not configured - email logged only)")
#             print(f"{'='*60}\n")
#             return
#         raise RuntimeError(
#             "Email chưa được cấu hình. Thêm SMTP_USER và SMTP_PASSWORD vào backend/.env"
#         )

#     msg = MIMEMultipart("alternative")
#     msg["Subject"] = subject
#     msg["From"] = settings.SMTP_FROM
#     msg["To"] = to
#     msg.attach(MIMEText(html, "html", "utf-8"))

#     try:
#         with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=30) as server:
#             server.ehlo()
#             server.starttls()
#             server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
#             server.sendmail(settings.SMTP_USER, to, msg.as_string())

#     except Exception as e:
#         print("SMTP ERROR:", repr(e))
#         raise


# def send_reset_password_email(to: str, full_name: str, reset_token: str) -> None:
#     reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"
#     subject = "TicketRush · Đặt lại mật khẩu của bạn"
#     preheader = "Yêu cầu đặt lại mật khẩu - link có hiệu lực trong 30 phút."
#     html = f"""<!DOCTYPE html>
# <html lang="vi">
# <head>
# <meta charset="UTF-8">
# <meta name="viewport" content="width=device-width, initial-scale=1.0">
# <meta name="x-apple-disable-message-reformatting">
# <title>{subject}</title>
# <!--[if mso]>
# <style type="text/css">
# table {{border-collapse:collapse; border:0; border-spacing:0; margin:0;}}
# div, td {{padding:0;}}
# div {{margin:0 !important;}}
# </style>
# <![endif]-->
# </head>
# <body style="margin:0;padding:0;width:100%;background-color:#0a0e1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">

# <!-- Preheader (hidden on render, shown in inbox preview) -->
# <div style="display:none;font-size:1px;color:#0a0e1a;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
# {preheader}
# </div>

# <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0e1a;">
#   <tr>
#     <td align="center" style="padding:48px 16px;">

#       <!-- Outer card -->
#       <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"
#              style="max-width:560px;width:100%;background-color:#0f172a;border-radius:20px;overflow:hidden;box-shadow:0 24px 48px -12px rgba(0,0,0,0.6);">

#         <!-- ── Top gradient bar ── -->
#         <tr>
#           <td style="height:4px;background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 50%,#a855f7 100%);font-size:0;line-height:0;">&nbsp;</td>
#         </tr>

#         <!-- ── Header with logo ── -->
#         <tr>
#           <td style="padding:32px 40px 0;">
#             <table role="presentation" cellpadding="0" cellspacing="0" border="0">
#               <tr>
#                 <td style="vertical-align:middle;padding-right:12px;">
#                   <table role="presentation" cellpadding="0" cellspacing="0" border="0">
#                     <tr>
#                       <td width="40" height="40" style="text-align:center;vertical-align:middle;">
#                         <img src="https://ticketrush-2026.vercel.app/ticketrush.png"
#                             width="32"
#                             height="32"
#                             alt="TicketRush"
#                             style="display:block;margin:0 auto;">
#                       </td>
#                     </tr>
#                   </table>
#                 </td>
#                 <td style="vertical-align:middle;">
#                   <span style="font-size:18px;font-weight:800;color:#fff;letter-spacing:0.5px;">
#                     Ticket<span style="color:#22d3ee;">Rush</span>
#                   </span>
#                 </td>
#               </tr>
#             </table>
#           </td>
#         </tr>

#         <!-- Spacer -->
#         <tr><td style="height:32px;font-size:0;line-height:0;">&nbsp;</td></tr>

#         <!-- ── Body ── -->
#         <tr>
#           <td style="padding:0 40px;">

#             <!-- Eyebrow -->
#             <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#22d3ee;text-transform:uppercase;letter-spacing:2px;">
#               🔐 Bảo mật tài khoản
#             </p>

#             <!-- Heading -->
#             <h1 style="margin:0 0 8px;font-size:28px;font-weight:800;line-height:1.25;color:#ffffff;letter-spacing:-0.3px;">
#               Đặt lại mật khẩu
#             </h1>
#             <p style="margin:0 0 24px;font-size:16px;color:#94a3b8;line-height:1.5;">
#               Xin chào <strong style="color:#e2e8f0;">{full_name}</strong>,
#             </p>

#             <!-- Body text -->
#             <p style="margin:0 0 28px;font-size:15px;color:#cbd5e1;line-height:1.7;">
#               Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản TicketRush của bạn.
#               Bấm vào nút bên dưới để tạo mật khẩu mới — quá trình chỉ mất vài giây.
#             </p>

#             <!-- ── CTA button ── -->
#             <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
#               <tr>
#                 <td style="border-radius:12px;background:linear-gradient(135deg,#0ea5e9,#6366f1);" bgcolor="#0ea5e9">
#                   <!--[if mso]>
#                   <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
#                     href="{reset_url}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="25%" stroke="f" fillcolor="#0ea5e9">
#                     <w:anchorlock/>
#                     <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">
#                       Đặt lại mật khẩu
#                     </center>
#                   </v:roundrect>
#                   <![endif]-->
#                   <!--[if !mso]><!-- -->
#                   <a href="{reset_url}" target="_blank"
#                      style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;
#                             color:#ffffff;text-decoration:none;border-radius:12px;letter-spacing:0.3px;
#                             mso-padding-alt:0;text-shadow:0 1px 0 rgba(0,0,0,0.1);">
#                     Đặt lại mật khẩu →
#                   </a>
#                   <!--<![endif]-->
#                 </td>
#               </tr>
#             </table>

#             <!-- ── Fallback URL ── -->
#             <p style="margin:0 0 8px;font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
#               Hoặc dán link này vào trình duyệt:
#             </p>
#             <p style="margin:0 0 32px;padding:14px 16px;background-color:#020617;border:1px solid rgba(255,255,255,0.06);border-radius:10px;font-size:12px;color:#94a3b8;word-break:break-all;font-family:'SF Mono',Menlo,Monaco,Consolas,monospace;line-height:1.5;">
#               <a href="{reset_url}" style="color:#22d3ee;text-decoration:none;">{reset_url}</a>
#             </p>

#             <!-- ── Info card ── -->
#             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
#                    style="background-color:rgba(34,211,238,0.06);border:1px solid rgba(34,211,238,0.18);border-radius:12px;margin:0 0 24px;">
#               <tr>
#                 <td style="padding:16px 20px;">
#                   <table role="presentation" cellpadding="0" cellspacing="0" border="0">
#                     <tr>
#                       <td valign="top" style="padding-right:12px;">
#                         <span style="display:inline-block;font-size:18px;line-height:1;">⏱️</span>
#                       </td>
#                       <td style="font-size:13px;color:#94a3b8;line-height:1.6;">
#                         <strong style="color:#22d3ee;">Link có hiệu lực trong 30 phút.</strong><br>
#                         Nếu hết hạn, bạn có thể yêu cầu một link mới từ trang đăng nhập.
#                       </td>
#                     </tr>
#                   </table>
#                 </td>
#               </tr>
#             </table>

#             <!-- ── Security notice ── -->
#             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
#                    style="background-color:rgba(251,191,36,0.06);border:1px solid rgba(251,191,36,0.18);border-radius:12px;">
#               <tr>
#                 <td style="padding:16px 20px;">
#                   <table role="presentation" cellpadding="0" cellspacing="0" border="0">
#                     <tr>
#                       <td valign="top" style="padding-right:12px;">
#                         <span style="display:inline-block;font-size:18px;line-height:1;">🛡️</span>
#                       </td>
#                       <td style="font-size:13px;color:#94a3b8;line-height:1.6;">
#                         <strong style="color:#fbbf24;">Không phải bạn?</strong><br>
#                         Bỏ qua email này — tài khoản của bạn vẫn an toàn. Không ai có thể đặt lại mật khẩu nếu không có link.
#                       </td>
#                     </tr>
#                   </table>
#                 </td>
#               </tr>
#             </table>

#           </td>
#         </tr>

#         <!-- Spacer -->
#         <tr><td style="height:32px;font-size:0;line-height:0;">&nbsp;</td></tr>

#         <!-- ── Footer ── -->
#         <tr>
#           <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);background-color:#020617;">
#             <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
#               <tr>
#                 <td style="font-size:12px;color:#475569;line-height:1.6;">
#                   © 2025 TicketRush. All rights reserved.<br>
#                   <span style="color:#334155;">Nền tảng đặt vé sự kiện hàng đầu Việt Nam</span>
#                 </td>
#                 <td align="right" style="font-size:12px;">
#                   <a href="{settings.FRONTEND_URL}" style="color:#64748b;text-decoration:none;margin-left:12px;">Trang chủ</a>
#                   <a href="mailto:support@ticketrush.vn" style="color:#64748b;text-decoration:none;margin-left:12px;">Hỗ trợ</a>
#                 </td>
#               </tr>
#             </table>
#           </td>
#         </tr>

#       </table>

#       <!-- Outer footer note -->
#       <p style="margin:24px 0 0;font-size:11px;color:#334155;line-height:1.6;max-width:560px;text-align:center;">
#         Email này được gửi tự động — vui lòng không trả lời.<br>
#         Cần hỗ trợ? Liên hệ <a href="mailto:support@ticketrush.vn" style="color:#475569;text-decoration:underline;">support@ticketrush.vn</a>
#       </p>

#     </td>
#   </tr>
# </table>

# </body>
# </html>"""
#     _send(to, subject, html)

"""
Email service - gửi mail bằng Resend API.
Không dùng SMTP nữa nên tránh lỗi network trên Render.

Cấu hình trong backend/.env:

RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=TicketRush <onboarding@resend.dev>
FRONTEND_URL=https://your-frontend.vercel.app
"""

import resend
import os
from dotenv import load_dotenv

load_dotenv()


# Khởi tạo API key
resend.api_key = os.getenv("RESEND_API_KEY")


def _send(to: str, subject: str, html: str) -> None:
    """Gửi email bằng Resend API."""

    if not os.getenv("RESEND_API_KEY"):
        if os.getenv("APP_ENV") == "development":
            print(f"\n{'='*60}")
            print(f"[DEV EMAIL] To: {to}")
            print(f"[DEV EMAIL] Subject: {subject}")
            print(f"[DEV EMAIL] (RESEND not configured - email logged only)")
            print(f"{'='*60}\n")
            return

        raise RuntimeError(
            "Email chưa được cấu hình. Thêm RESEND_API_KEY vào backend/.env"
        )

    try:
        response = resend.Emails.send(
            {
                "from": os.getenv("EMAIL_FROM"),
                "to": [to],
                "subject": subject,
                "html": html,
            }
        )

        print("Email sent successfully:", response)

    except Exception as e:
        print("RESEND ERROR:", repr(e))
        raise


def send_reset_password_email(
    to: str,
    full_name: str,
    reset_token: str,
) -> None:
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password/{reset_token}"

    subject = "TicketRush · Đặt lại mật khẩu của bạn"

    preheader = (
        "Yêu cầu đặt lại mật khẩu - link có hiệu lực trong 30 phút."
    )

    html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{subject}</title>
</head>

<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:Arial,sans-serif;">

<div style="display:none;opacity:0;max-height:0;overflow:hidden;">
{preheader}
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e1a;padding:40px 16px;">
<tr>
<td align="center">

<table width="560" cellpadding="0" cellspacing="0"
style="background:#0f172a;border-radius:20px;overflow:hidden;">

<tr>
<td style="height:4px;background:linear-gradient(135deg,#0ea5e9,#6366f1,#a855f7);"></td>
</tr>

<tr>
<td style="padding:32px 40px;">

<h1 style="color:#fff;font-size:28px;margin:0 0 16px;">
Đặt lại mật khẩu
</h1>

<p style="color:#cbd5e1;font-size:15px;line-height:1.7;">
Xin chào
<strong style="color:#fff;">{full_name}</strong>,
</p>

<p style="color:#cbd5e1;font-size:15px;line-height:1.7;">
Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản TicketRush của bạn.
</p>

<div style="margin:32px 0;">
<a href="{reset_url}"
style="
display:inline-block;
padding:14px 32px;
background:linear-gradient(135deg,#0ea5e9,#6366f1);
color:#fff;
text-decoration:none;
border-radius:12px;
font-weight:700;
">
Đặt lại mật khẩu →
</a>
</div>

<p style="color:#94a3b8;font-size:13px;line-height:1.7;">
Hoặc dán link này vào trình duyệt:
</p>

<p style="
background:#020617;
padding:14px;
border-radius:10px;
word-break:break-all;
font-size:12px;
">
<a href="{reset_url}" style="color:#22d3ee;">
{reset_url}
</a>
</p>

<div style="
margin-top:24px;
padding:16px;
background:rgba(34,211,238,0.06);
border-radius:12px;
border:1px solid rgba(34,211,238,0.18);
">
<p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
<strong style="color:#22d3ee;">
Link có hiệu lực trong 30 phút.
</strong>
</p>
</div>

<div style="
margin-top:16px;
padding:16px;
background:rgba(251,191,36,0.06);
border-radius:12px;
border:1px solid rgba(251,191,36,0.18);
">
<p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
<strong style="color:#fbbf24;">
Không phải bạn?
</strong><br>
Bỏ qua email này — tài khoản của bạn vẫn an toàn.
</p>
</div>

</td>
</tr>

<tr>
<td style="
padding:24px 40px;
background:#020617;
border-top:1px solid rgba(255,255,255,0.06);
">
<p style="margin:0;color:#475569;font-size:12px;line-height:1.6;">
© 2026 TicketRush. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
"""

    _send(to, subject, html)