"""Build the checked-in study PDFs using Python and ReportLab."""
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, SimpleDocTemplate

root = Path(__file__).resolve().parents[1]
destination = root / "public/recursos/archivos"
destination.mkdir(parents=True, exist_ok=True)
content = json.loads((root / "lib/worksheets.json").read_text(encoding="utf-8"))
os.environ["SOURCE_DATE_EPOCH"] = str(int(datetime(2026, 11, 20, tzinfo=timezone.utc).timestamp()))
navy = colors.HexColor("#122641")
graphite = colors.HexColor("#45566b")
styles = {
    "brand": ParagraphStyle("brand", fontName="Helvetica-Bold", textColor=navy, fontSize=11, spaceAfter=14),
    "title": ParagraphStyle("title", fontName="Helvetica-Bold", textColor=navy, fontSize=24, leading=29, spaceAfter=12),
    "heading": ParagraphStyle("heading", fontName="Helvetica-Bold", textColor=navy, fontSize=13, leading=17, spaceBefore=10, spaceAfter=4),
    "body": ParagraphStyle("body", fontName="Helvetica", textColor=graphite, fontSize=11, leading=16, spaceAfter=6),
}


def paragraph(value, style):
    return Paragraph(escape(value), styles[style])


def footer(canvas, document):
    canvas.setStrokeColor(colors.HexColor("#d0b477"))
    canvas.line(48, 50, document.pagesize[0] - 48, 50)
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(graphite)
    canvas.drawString(48, 36, "Arkez Invest · Material educativo · Datos ilustrativos")
    canvas.drawRightString(document.pagesize[0] - 48, 36, str(document.page))


for slug, resource in content.items():
    document = SimpleDocTemplate(
        str(destination / f"{slug}.pdf"), title=resource["title"], author="Arkez Invest",
        lang="es", leftMargin=48, rightMargin=48, topMargin=43, bottomMargin=68,
    )
    story = [
        paragraph("ARKEZ INVEST", "brand"),
        paragraph(resource["title"], "title"),
        paragraph(resource["intro"], "body"),
    ]
    for topic in resource["topics"]:
        story.extend((paragraph(topic["title"], "heading"), paragraph(topic["body"], "body")))
    document.build(story, onFirstPage=footer, onLaterPages=footer)
