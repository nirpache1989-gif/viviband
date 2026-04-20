"""Generate a short follow-up PDF for Viviane: Vercel access token step."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

ACCENT = HexColor("#ff1f6b")
DARK = HexColor("#0a0a0a")
GRAY = HexColor("#555555")
LIGHT_GRAY = HexColor("#f0f0f0")
BORDER = HexColor("#dddddd")

doc = SimpleDocTemplate(
    "C:/AI/ViviBAnd/docs/cores-do-samba-vercel-token.pdf",
    pagesize=A4,
    leftMargin=2 * cm, rightMargin=2 * cm,
    topMargin=2 * cm, bottomMargin=2 * cm,
)

styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    "TitleBig", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=26,
    textColor=DARK, leading=30, spaceAfter=6, alignment=TA_LEFT,
)
subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=12,
    textColor=GRAY, leading=16, spaceAfter=24,
)
h1_style = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=16,
    textColor=ACCENT, leading=20, spaceBefore=14, spaceAfter=8,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11,
    textColor=DARK, leading=16, spaceAfter=6,
)
tip_style = ParagraphStyle(
    "Tip", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=10,
    textColor=GRAY, leading=14, spaceAfter=6,
)

story = []

story.append(Paragraph("LAST STEP — VERCEL ACCESS TOKEN", title_style))
story.append(Paragraph(
    "Thanks Vivi! You've almost got everything set up. One more thing: "
    "the free Vercel plan doesn't let you invite team members, but it does let "
    "you create an access token we can use to deploy on your behalf. Takes 2 minutes.",
    subtitle_style,
))

story.append(Paragraph("1 — Open Vercel tokens page", h1_style))
story.append(Paragraph(
    "Make sure you're logged into Vercel in your browser, then open this link:",
    body_style,
))
link_box = Table(
    [[Paragraph('<font face="Courier"><b>https://vercel.com/account/tokens</b></font>', body_style)]],
    colWidths=[16 * cm],
)
link_box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
    ("BOX", (0, 0), (-1, -1), 0.5, ACCENT),
    ("LEFTPADDING", (0, 0), (-1, -1), 14),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
]))
story.append(link_box)
story.append(Spacer(1, 12))

story.append(Paragraph("2 — Create the token", h1_style))
story.append(Paragraph("• Click the <b>Create Token</b> button", body_style))
story.append(Paragraph("• Token name: <font face='Courier'>Cores do Samba Deploy</font>", body_style))
story.append(Paragraph("• Scope: <b>Full Account</b> (the default is fine)", body_style))
story.append(Paragraph("• Expiration: <b>No Expiration</b> (or pick 1 year)", body_style))
story.append(Paragraph("• Click <b>Create</b>", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("3 — Copy the token", h1_style))
story.append(Paragraph(
    "Vercel will show the token ONCE on the screen. It starts with something like "
    "<font face='Courier'>vercel_...</font> — click the copy button next to it.",
    body_style,
))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>Important:</b> you can't see the token again after closing the page. "
    "If you lose it, just come back here and create a new one.",
    tip_style,
))
story.append(Spacer(1, 10))

story.append(Paragraph("4 — Send it to Nir", h1_style))
story.append(Paragraph(
    "Paste the token into a message and send it. That's it — I'll use it to "
    "deploy the site on your Vercel account. The site will be live within minutes.",
    body_style,
))
story.append(Spacer(1, 20))

story.append(Paragraph(
    "<b>What happens next:</b> once I have the token, I'll create the project "
    "on your Vercel, connect it to the website code, plug in your Supabase and "
    "Resend keys, and deploy. You'll get a link like "
    "<font face='Courier'>cores-do-samba.vercel.app</font> and a password to the "
    "admin panel where you can add shows, music, and photos yourself.",
    body_style,
))
story.append(Spacer(1, 30))

story.append(Paragraph(
    "Obrigado Vivi! 🧡",
    ParagraphStyle(
        "Outro", parent=body_style,
        fontName="Helvetica-Bold", fontSize=14,
        textColor=ACCENT, alignment=TA_CENTER,
    ),
))

doc.build(story)
print("PDF written to C:/AI/ViviBAnd/docs/cores-do-samba-vercel-token.pdf")
