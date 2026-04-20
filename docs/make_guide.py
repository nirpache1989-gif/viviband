"""Generate a step-by-step setup guide PDF for Viviane."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table,
    TableStyle, ListFlowable, ListItem
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

# Brand colors
ACCENT = HexColor("#E85D04")  # burnt orange
DARK = HexColor("#0a0a0a")
GRAY = HexColor("#555555")
LIGHT_GRAY = HexColor("#f0f0f0")
BORDER = HexColor("#dddddd")

doc = SimpleDocTemplate(
    "C:/AI/ViviBAnd/docs/cores-do-samba-setup-guide.pdf",
    pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=2*cm,
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "TitleBig", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=28,
    textColor=DARK, leading=34, spaceAfter=6, alignment=TA_LEFT,
)
subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=12,
    textColor=GRAY, leading=16, spaceAfter=24,
)
h1_style = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=18,
    textColor=ACCENT, leading=22, spaceBefore=16, spaceAfter=10,
)
h2_style = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=13,
    textColor=DARK, leading=17, spaceBefore=10, spaceAfter=6,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11,
    textColor=DARK, leading=16, spaceAfter=6,
)
small_style = ParagraphStyle(
    "Small", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9,
    textColor=GRAY, leading=12, spaceAfter=4,
)
code_style = ParagraphStyle(
    "Code", parent=styles["Code"],
    fontName="Courier", fontSize=9,
    textColor=DARK, leading=12, spaceAfter=4,
    leftIndent=10,
)
tip_style = ParagraphStyle(
    "Tip", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=10,
    textColor=GRAY, leading=14, spaceAfter=6,
    leftIndent=8, borderPadding=6,
)

story = []

# === COVER / INTRO ===
story.append(Paragraph("CORES DO SAMBA", title_style))
story.append(Paragraph("Website Setup Guide — what I need from you", subtitle_style))

story.append(Paragraph(
    "Hi Vivi! To put your band's website online, I need you to create "
    "a few free accounts and give me access so I can handle all the "
    "technical setup. This guide walks you through it in 3 simple steps. "
    "It should take about <b>10 minutes</b>.",
    body_style
))
story.append(Spacer(1, 12))

# Quick summary box
summary_data = [
    [Paragraph("<b>What you'll do</b>", body_style)],
    [Paragraph("1. Create a Supabase account (database)", body_style)],
    [Paragraph("2. Create a Vercel account (website hosting)", body_style)],
    [Paragraph("3. Send me 3 things by message", body_style)],
]
summary_table = Table(summary_data, colWidths=[16*cm])
summary_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
    ("TEXTCOLOR", (0, 0), (-1, 0), white),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_GRAY),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 12),
    ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
# Override header text color
summary_data[0] = [Paragraph('<font color="white"><b>What you\'ll do</b></font>', body_style)]
summary_table = Table(summary_data, colWidths=[16*cm])
summary_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), ACCENT),
    ("BACKGROUND", (0, 1), (-1, -1), LIGHT_GRAY),
    ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ("LINEBELOW", (0, 0), (-1, 0), 0.5, BORDER),
    ("LEFTPADDING", (0, 0), (-1, -1), 14),
    ("RIGHTPADDING", (0, 0), (-1, -1), 14),
    ("TOPPADDING", (0, 0), (-1, -1), 10),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
]))
story.append(summary_table)
story.append(Spacer(1, 18))

story.append(Paragraph(
    "<b>Important:</b> when you finish, don't try to deploy anything — "
    "just send me the info at the end of this guide and I'll handle the rest.",
    tip_style
))

story.append(PageBreak())

# === STEP 1: SUPABASE ===
story.append(Paragraph("Step 1 — Supabase (database)", h1_style))
story.append(Paragraph(
    "Supabase stores all the site's content: shows, photos, music links, etc. "
    "You've already started this — just finish it and add me as a member.",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("1.1 — Finish the project setup", h2_style))
story.append(Paragraph(
    "Go to <b>supabase.com</b> and log into your account. You should see your "
    "project in the dashboard. If the project isn't fully created yet:",
    body_style
))
story.append(Paragraph("• Click <b>New project</b>", body_style))
story.append(Paragraph("• Project name: <font face='Courier'>cores-do-samba</font>", body_style))
story.append(Paragraph("• Region: <b>South America (São Paulo)</b>", body_style))
story.append(Paragraph("• Click <b>Generate a password</b> (save it for yourself)", body_style))
story.append(Paragraph("• Click <b>Create new project</b> and wait ~1 minute", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("1.2 — Add me as a member", h2_style))
story.append(Paragraph(
    "So I can set up the database tables for you:",
    body_style
))
story.append(Paragraph("• In Supabase, click your <b>organization name</b> (top left)", body_style))
story.append(Paragraph("• Click <b>Team</b> or <b>Members</b> in the left sidebar", body_style))
story.append(Paragraph("• Click <b>Invite</b> and enter my email:", body_style))
story.append(Spacer(1, 4))

email_box = Table(
    [[Paragraph('<font face="Courier"><b>nirpache1989@gmail.com</b></font>', body_style)]],
    colWidths=[16*cm]
)
email_box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GRAY),
    ("BOX", (0, 0), (-1, -1), 0.5, ACCENT),
    ("LEFTPADDING", (0, 0), (-1, -1), 14),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(email_box)
story.append(Spacer(1, 6))
story.append(Paragraph(
    "• Set role to <b>Owner</b> or <b>Administrator</b> and send the invite",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("1.3 — Get the keys for me", h2_style))
story.append(Paragraph(
    "Open your project, then click <b>Settings</b> (gear icon, bottom left) → "
    "<b>API Keys</b> → click the tab <b>\"Legacy anon, service_role API keys\"</b>. "
    "You need to copy these two things and save them for the end:",
    body_style
))
story.append(Paragraph("<b>A)</b> Project URL — at the top of the page, looks like:", body_style))
story.append(Paragraph("<font face='Courier'>https://xxxxxxxx.supabase.co</font>", code_style))
story.append(Paragraph("<b>B)</b> <b>anon public</b> key — a long text starting with <font face='Courier'>eyJ...</font>", body_style))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>Tip:</b> don't share the \"service_role\" key with anyone, only the "
    "<i>anon public</i> one. Keep the service_role secret.",
    tip_style
))

story.append(PageBreak())

# === STEP 2: VERCEL ===
story.append(Paragraph("Step 2 — Vercel (hosting)", h1_style))
story.append(Paragraph(
    "Vercel is where your website actually lives on the internet. "
    "It's free for sites like yours.",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("2.1 — Create the account", h2_style))
story.append(Paragraph("• Go to <b>vercel.com</b>", body_style))
story.append(Paragraph("• Click <b>Sign Up</b> and choose <b>Continue with GitHub</b>", body_style))
story.append(Paragraph(
    "• If you don't have GitHub yet, create a free account first at "
    "<b>github.com</b>, then come back",
    body_style
))
story.append(Paragraph(
    "• When asked, select the <b>Hobby</b> plan (it's free)",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("2.2 — Accept the GitHub invite", h2_style))
story.append(Paragraph(
    "I already sent you a GitHub invite to the website code. Accept it:",
    body_style
))
story.append(Paragraph(
    "• Check your email for a message from GitHub, <b>or</b> go to:",
    body_style
))
story.append(Paragraph(
    "<font face='Courier'>https://github.com/nirpache1989-gif/viviband/invitations</font>",
    code_style
))
story.append(Paragraph("• Click <b>Accept invitation</b>", body_style))
story.append(Spacer(1, 10))

story.append(Paragraph("2.3 — Add me to your Vercel team", h2_style))
story.append(Paragraph(
    "So I can deploy the site for you:",
    body_style
))
story.append(Paragraph("• In Vercel, click <b>Settings</b> (top right)", body_style))
story.append(Paragraph("• Click <b>Team Members</b> in the sidebar", body_style))
story.append(Paragraph("• Click <b>Invite</b> and enter:", body_style))
story.append(Spacer(1, 4))
story.append(email_box)
story.append(Spacer(1, 6))
story.append(Paragraph("• Set role to <b>Owner</b> and send the invite", body_style))
story.append(Spacer(1, 6))
story.append(Paragraph(
    "<b>That's it for Vercel!</b> Don't click \"New Project\" — I'll handle that "
    "once I have access.",
    tip_style
))

story.append(PageBreak())

# === STEP 3: RESEND (OPTIONAL) ===
story.append(Paragraph("Step 3 — Resend (optional, for contact form)", h1_style))
story.append(Paragraph(
    "This lets the contact form on the site actually send you emails when "
    "someone messages the band. You can skip this for now and add it later.",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("3.1 — Create a Resend account (if you want)", h2_style))
story.append(Paragraph("• Go to <b>resend.com</b> and sign up", body_style))
story.append(Paragraph("• Once logged in, click <b>API Keys</b> in the sidebar", body_style))
story.append(Paragraph("• Click <b>Create API Key</b>, give it any name", body_style))
story.append(Paragraph(
    "• Copy the key (starts with <font face='Courier'>re_...</font>) "
    "— you only see it once!",
    body_style
))
story.append(Spacer(1, 10))

story.append(Paragraph("3.2 — Decide your contact email", h2_style))
story.append(Paragraph(
    "Tell me which email address you want to receive messages from the website's "
    "contact form. It can be any email you already have (gmail, etc).",
    body_style
))

story.append(Spacer(1, 20))

# === FINAL: WHAT TO SEND ===
story.append(Paragraph("Send me these when you're done", h1_style))

checklist_data = [
    ["✓", "Confirmed Supabase invite sent to nirpache1989@gmail.com"],
    ["✓", "Confirmed Vercel invite sent to nirpache1989@gmail.com"],
    ["✓", "Confirmed GitHub invite accepted"],
    ["", "Supabase Project URL (from Step 1.3)"],
    ["", "Supabase anon public key (from Step 1.3)"],
    ["", "Resend API key (from Step 3.1) — optional"],
    ["", "Contact email address (from Step 3.2) — optional"],
]
checklist_rows = []
for mark, label in checklist_data:
    checklist_rows.append([
        Paragraph(f'<font color="#E85D04"><b>{mark or "☐"}</b></font>', body_style),
        Paragraph(label, body_style)
    ])
checklist = Table(checklist_rows, colWidths=[0.8*cm, 15.2*cm])
checklist.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LINEBELOW", (0, 0), (-1, -2), 0.25, BORDER),
]))
story.append(checklist)
story.append(Spacer(1, 18))

story.append(Paragraph(
    "Once I get everything, I'll set up the database, deploy the site, and "
    "send you the live link the same day. Then I'll give you access to a "
    "simple admin panel where you can add shows, photos, and music yourself.",
    body_style
))
story.append(Spacer(1, 12))

story.append(Paragraph(
    "Thanks Vivi! Let me know if anything is unclear. 🧡",
    ParagraphStyle(
        "Outro", parent=body_style,
        fontName="Helvetica-Bold", fontSize=12,
        textColor=ACCENT, alignment=TA_CENTER,
    )
))

doc.build(story)
print("PDF written to C:/AI/ViviBAnd/docs/cores-do-samba-setup-guide.pdf")
