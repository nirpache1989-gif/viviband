"""Generate a short follow-up PDF for Viviane: deploy via Vercel-GitHub integration."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

ACCENT = HexColor("#ff1f6b")
DARK = HexColor("#0a0a0a")
GRAY = HexColor("#555555")
LIGHT_GRAY = HexColor("#f0f0f0")
BORDER = HexColor("#dddddd")

doc = SimpleDocTemplate(
    "C:/AI/ViviBAnd/docs/cores-do-samba-vercel-deploy.pdf",
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
code_style = ParagraphStyle(
    "Code", parent=styles["Code"],
    fontName="Courier", fontSize=9,
    textColor=DARK, leading=12, spaceAfter=4,
    leftIndent=10,
)

story = []

story.append(Paragraph("DEPLOY STEP \u2014 VERCEL + GITHUB", title_style))
story.append(Paragraph(
    "You\u2019re already a collaborator on the GitHub repo. Easiest path now: "
    "connect your Vercel to GitHub and import the project yourself. "
    "Takes about 5 minutes. You\u2019ll end up with the site live on your "
    "own Vercel account.",
    subtitle_style,
))

# Step 1
story.append(Paragraph("1 \u2014 Open Vercel and click \u201CAdd New Project\u201D", h1_style))
story.append(Paragraph(
    "Go to <b>https://vercel.com/new</b> (make sure you\u2019re logged in).",
    body_style,
))
story.append(Spacer(1, 10))

# Step 2
story.append(Paragraph("2 \u2014 Connect GitHub (first time only)", h1_style))
story.append(Paragraph(
    "If you haven\u2019t connected GitHub yet, Vercel will ask. Click "
    "<b>Continue with GitHub</b> and sign in.",
    body_style,
))
story.append(Paragraph(
    "When GitHub asks which repositories Vercel can access, choose:",
    body_style,
))
story.append(Paragraph(
    "\u2022 \u201CAll repositories\u201D (simplest), OR",
    body_style,
))
story.append(Paragraph(
    "\u2022 \u201COnly select repositories\u201D and pick "
    "<font face='Courier'>nirpache1989-gif/viviband</font>",
    body_style,
))
story.append(Spacer(1, 10))

# Step 3
story.append(Paragraph("3 \u2014 Import the repo", h1_style))
story.append(Paragraph(
    "Back on Vercel\u2019s \u201CAdd New Project\u201D screen, find "
    "<font face='Courier'>nirpache1989-gif/viviband</font> in the list and click "
    "<b>Import</b>.",
    body_style,
))
story.append(Paragraph(
    "Project name: leave as <font face='Courier'>viviband</font> or change it to "
    "<font face='Courier'>cores-do-samba</font> if you want the cleaner URL.",
    body_style,
))
story.append(Spacer(1, 10))

# Step 4
story.append(Paragraph("4 \u2014 Paste the environment variables", h1_style))
story.append(Paragraph(
    "<b>Don\u2019t click Deploy yet.</b> Expand the <b>Environment Variables</b> "
    "section first. You need to add 5 variables. Click Nir has sent you the "
    "exact values \u2014 copy each <b>key</b> and <b>value</b> from the message:",
    body_style,
))
story.append(Spacer(1, 6))

vars_data = [
    [Paragraph("<b>Key</b>", body_style), Paragraph("<b>Where it came from</b>", body_style)],
    [Paragraph("<font face='Courier'>NEXT_PUBLIC_SUPABASE_URL</font>", body_style),
     Paragraph("Your Supabase project URL", body_style)],
    [Paragraph("<font face='Courier'>NEXT_PUBLIC_SUPABASE_ANON_KEY</font>", body_style),
     Paragraph("Your Supabase anon public key (the long eyJ\u2026 string)", body_style)],
    [Paragraph("<font face='Courier'>ADMIN_PASSWORD</font>", body_style),
     Paragraph("Nir will generate this and send it to you", body_style)],
    [Paragraph("<font face='Courier'>RESEND_API_KEY</font>", body_style),
     Paragraph("Your Resend API key (the re_\u2026 string)", body_style)],
    [Paragraph("<font face='Courier'>BAND_CONTACT_EMAIL</font>", body_style),
     Paragraph("vivianesalvadordossantos@gmail.com", body_style)],
]
vars_table = Table(vars_data, colWidths=[7 * cm, 9 * cm])
vars_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_GRAY),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.25, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(vars_table)
story.append(Spacer(1, 8))

story.append(Paragraph(
    "Paste each <b>key</b> into the left input and the <b>value</b> into the "
    "right input, click <b>Add</b>, then repeat for the next one.",
    body_style,
))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>Shortcut:</b> Vercel accepts pasting the whole <font face='Courier'>.env</font> "
    "block at once. If Nir sends you the 5 variables as "
    "<font face='Courier'>KEY=value</font> lines, you can paste them straight into "
    "the first key field and Vercel will split them into rows.",
    tip_style,
))

story.append(PageBreak())

# Step 5
story.append(Paragraph("5 \u2014 Click Deploy", h1_style))
story.append(Paragraph(
    "Once all 5 variables are there, click the big <b>Deploy</b> button. Vercel "
    "will spend 2\u20133 minutes building. When it finishes you\u2019ll see "
    "confetti and a preview of the homepage.",
    body_style,
))
story.append(Spacer(1, 10))

# Step 6
story.append(Paragraph("6 \u2014 Send Nir the live URL", h1_style))
story.append(Paragraph(
    "At the top of the deployment page you\u2019ll see a URL like "
    "<font face='Courier'>cores-do-samba.vercel.app</font> (or whatever you "
    "named the project). Click it to open the site and confirm it loads. Send "
    "the URL to Nir so he can run final checks.",
    body_style,
))
story.append(Spacer(1, 16))

# Logging into admin
story.append(Paragraph("Later \u2014 logging into your admin panel", h1_style))
story.append(Paragraph(
    "Once the site is live, you can add shows, music, and photos yourself:",
    body_style,
))
story.append(Paragraph("\u2022 Go to <font face='Courier'>your-site.vercel.app/pt/admin/login</font>", body_style))
story.append(Paragraph("\u2022 Enter the admin password Nir sent you", body_style))
story.append(Paragraph("\u2022 You\u2019ll land on a dashboard. Add/edit/delete anything from there.", body_style))
story.append(Paragraph(
    "While you\u2019re logged in, a small <b>Tweaks</b> panel appears in the "
    "bottom-right of the public pages. Use it to change the color palette, "
    "font, or film grain of the whole site \u2014 changes save automatically "
    "and every visitor sees them.",
    body_style,
))
story.append(Spacer(1, 24))

story.append(Paragraph(
    "Obrigado Vivi! 🧡",
    ParagraphStyle(
        "Outro", parent=body_style,
        fontName="Helvetica-Bold", fontSize=14,
        textColor=ACCENT, alignment=TA_CENTER,
    ),
))

doc.build(story)
print("PDF written to C:/AI/ViviBAnd/docs/cores-do-samba-vercel-deploy.pdf")
