"""Export the study editions and their actual cover thumbnails."""
import json
import math
import os
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

import fitz
from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/recursos/archivos"
COVERS = ROOT / "public/recursos/portadas"
CATALOG = json.loads((ROOT / "resources/editorial.json").read_text(encoding="utf-8"))
DATE = datetime.fromisoformat(CATALOG["updated"]).replace(tzinfo=timezone.utc)
os.environ["SOURCE_DATE_EPOCH"] = str(int(DATE.timestamp()))
UPDATED = DATE.strftime("%d/%m/%Y")
NAVY, INK, GOLD = map(HexColor, ("#0D1E35", "#233B55", "#E6C376"))
COPY, IVORY, LINE = map(HexColor, ("#45566B", "#F8F5EC", "#D5DEE7"))
PAGE_W, PAGE_H = A4
LEFT = 48
W = PAGE_W - LEFT * 2
STYLE = {
    "title": ParagraphStyle("title", fontName="Times-Bold", fontSize=32, leading=34, textColor=NAVY),
    "cover": ParagraphStyle("cover", fontName="Times-Bold", fontSize=57, leading=56, textColor=white),
    "cover_sub": ParagraphStyle("cover_sub", fontSize=17, leading=24, textColor=white),
    "body": ParagraphStyle("body", fontSize=11.5, leading=16, textColor=COPY),
    "small": ParagraphStyle("small", fontSize=9, leading=12, textColor=COPY),
    "cell": ParagraphStyle("cell", fontSize=10, leading=13, textColor=NAVY),
    "head": ParagraphStyle("head", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=white),
    "link": ParagraphStyle("link", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INK),
    "flow": ParagraphStyle("flow", fontName="Helvetica-Bold", fontSize=9, leading=11, textColor=NAVY, alignment=1),
}


def label(canvas, text, x, y, *, size=9, color=COPY):
    canvas.setFillColor(color)
    canvas.setFont("Helvetica-Bold", size)
    canvas.drawString(x, y, text)


def paragraph(canvas, text, x, top, style, width=W, *, markup=False):
    item = Paragraph(text if markup else escape(text), STYLE[style])
    _, height = item.wrap(width, PAGE_H)
    item.drawOn(canvas, x, top - height)
    return top - height


def page_frame(canvas, document, title):
    y = PAGE_H - 45
    label(canvas, "ARKEZ INVEST", LEFT, y, color=NAVY)
    label(canvas, document["series"], LEFT + 104, y)
    canvas.setStrokeColor(LINE)
    canvas.line(LEFT, y - 12, PAGE_W - LEFT, y - 12)
    y = paragraph(canvas, title, LEFT, y - 36, "title")
    canvas.setStrokeColor(LINE)
    canvas.line(LEFT, 54, PAGE_W - LEFT, 54)
    label(canvas, f"Arkez Invest  /  Actualización {UPDATED}", LEFT, 35)
    label(canvas, f"{canvas.getPageNumber():02d}", PAGE_W - LEFT - 17, 35, color=NAVY)
    return y - 22


def cover(canvas, document):
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.roundRect(LEFT, PAGE_H - 144, 176, 87, 7, fill=1, stroke=0)
    canvas.drawImage(str(ROOT / "public/brand/logo.png"), LEFT + 16, PAGE_H - 125, width=144, height=52.1, mask="auto")
    canvas.setFillColor(GOLD)
    canvas.rect(LEFT, PAGE_H - 212, 50, 3, fill=1, stroke=0)
    label(canvas, document["series"].upper(), LEFT, PAGE_H - 245, size=12, color=GOLD)
    y = paragraph(canvas, document["title"], LEFT, PAGE_H - 269, "cover", W - 16)
    y = paragraph(canvas, document["subtitle"], LEFT, y - 23, "cover_sub", W - 35)
    canvas.setStrokeColor(GOLD)
    canvas.line(LEFT, 151, PAGE_W - LEFT, 151)
    label(canvas, f"Nivel {document['level'].lower()}", LEFT, 121, size=12, color=white)
    label(canvas, f"Actualización {UPDATED}", LEFT, 99, color=white)
    label(canvas, "Ejercicios con cifras ficticias", LEFT, 77, color=GOLD)
    assert y > 170
    canvas.showPage()


def contents(canvas, document):
    y = page_frame(canvas, document, "Índice")
    y = paragraph(canvas, "Lee cada caso, resuelve el ejercicio y contrasta tu respuesta con la solución. Conserva los supuestos junto con tus cálculos.", LEFT, y, "body") - 22
    entries = [chapter["title"] for chapter in document["chapters"]] + ["Conclusiones y fuentes"]
    for number, title in enumerate(entries, start=3):
        label(canvas, str(number).zfill(2), LEFT + 8, y - 15, size=12, color=INK)
        bottom = paragraph(canvas, title, LEFT + 48, y, "body", W - 64)
        canvas.linkRect("", f"page-{number}", (LEFT, bottom - 8, LEFT + W, y + 3), relative=0, thickness=0)
        canvas.setStrokeColor(LINE)
        canvas.line(LEFT, bottom - 10, LEFT + W, bottom - 10)
        y = bottom - 29
    paragraph(canvas, "Material educativo. Las cifras corresponden a supuestos de trabajo y no representan productos, señales de compra ni resultados esperados.", LEFT, y - 14, "body")
    canvas.showPage()


def draw_figure(canvas, figure, top):
    box_h = 93 if figure["type"] == "flow" else 146
    bottom = top - box_h
    canvas.setFillColor(IVORY)
    canvas.roundRect(LEFT, bottom, W, box_h, 6, stroke=0, fill=1)
    caption = figure.get("unit", "Secuencia de trabajo")
    label(canvas, caption, LEFT + 15, top - 17, color=NAVY)
    if figure["type"] == "flow":
        count = len(figure["labels"])
        step = (W - 30) / count
        for i, title in enumerate(figure["labels"]):
            x = LEFT + 15 + i * step
            canvas.setFillColor(white)
            canvas.setStrokeColor(LINE)
            canvas.roundRect(x, bottom + 17, step - 11, 42, 5, fill=1, stroke=1)
            paragraph(canvas, title, x + 4, bottom + 44, "flow", step - 19)
            if i < count - 1:
                a = x + step - 8
                canvas.setStrokeColor(INK)
                canvas.line(a, bottom + 38, a + 5, bottom + 38)
                canvas.line(a + 3, bottom + 41, a + 6, bottom + 38)
                canvas.line(a + 6, bottom + 38, a + 3, bottom + 35)
        return bottom - 17

    values = figure["values"]
    left, right = LEFT + 48, LEFT + W - 22
    floor, ceiling = bottom + 24, top - 36
    minimum, maximum = min(values), max(values)
    if figure["type"] == "bars":
        minimum, maximum = min(minimum, 0), max(maximum, 0)
    span = max(maximum - minimum, 1)
    increment = max(1, round(span / 4))
    low = math.floor((minimum - span * .08) / increment) * increment
    high = math.ceil((maximum + span * .10) / increment) * increment

    def position(value):
        return floor + (value - low) / (high - low) * (ceiling - floor)

    for tick in range(low, high + 1, increment):
        y = position(tick)
        canvas.setStrokeColor(INK if tick == 0 else LINE)
        canvas.line(left, y, right, y)
        label(canvas, str(tick), LEFT + 11, y - 3, size=7)
    step = (right - left) / len(values)
    points = [(left + (i + .5) * step, position(value)) for i, value in enumerate(values)]
    if figure["type"] == "line":
        canvas.setStrokeColor(INK)
        canvas.setLineWidth(2)
        for first, second in zip(points, points[1:]):
            canvas.line(*first, *second)
        canvas.setLineWidth(1)
    for (x, y), value, description in zip(points, values, figure["labels"]):
        canvas.setFillColor(GOLD if value >= 0 else INK)
        if figure["type"] == "bars":
            baseline = position(0)
            canvas.rect(x - 16, min(y, baseline), 32, abs(y - baseline), fill=1, stroke=0)
        else:
            canvas.circle(x, y, 4, fill=1, stroke=0)
        canvas.setFillColor(NAVY)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawCentredString(x, y + 6 if value >= 0 or y - 10 < floor + 3 else y - 10, str(value))
        canvas.drawCentredString(x, bottom + 9, description)
    return bottom - 17


def draw_table(canvas, data, top):
    rows = [[Paragraph(escape(cell), STYLE[style]) for cell in cells]
            for cells, style in [(data["headers"], "head"), *((cells, "cell") for cells in data["rows"])]]
    widths = [W / len(rows[0])] * len(rows[0])
    table = Table(rows, colWidths=widths, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, IVORY]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LINEBELOW", (0, 0), (-1, -1), .4, LINE),
    ]))
    _, height = table.wrap(W, PAGE_H)
    table.drawOn(canvas, LEFT, top - height)
    return top - height - 18


def chapter_page(canvas, doc, chapter):
    canvas.bookmarkPage(f"page-{canvas.getPageNumber()}", fit="XYZ", left=0, top=PAGE_H, zoom=0)
    y = page_frame(canvas, doc, chapter["title"])
    y = paragraph(canvas, chapter["lead"], LEFT, y, "body") - 16
    y = draw_figure(canvas, chapter["figure"], y)
    y = draw_table(canvas, chapter["table"], y)
    label(canvas, "PONLO EN PRÁCTICA", LEFT, y, size=9, color=NAVY)
    y = paragraph(canvas, chapter["exercise"], LEFT, y - 8, "body") - 19
    label(canvas, "SOLUCIÓN COMENTADA", LEFT, y, size=9, color=NAVY)
    y = paragraph(canvas, chapter["answer"], LEFT, y - 8, "body")
    assert y >= 70, (doc["slug"], chapter["title"], y)
    canvas.showPage()


def conclusions(canvas, document):
    canvas.bookmarkPage(f"page-{canvas.getPageNumber()}", fit="XYZ", left=0, top=PAGE_H, zoom=0)
    y = page_frame(canvas, document, "Conclusiones y fuentes")
    for i, conclusion in enumerate(document["conclusions"], start=1):
        label(canvas, f"{i:02d}", LEFT, y - 13, color=NAVY)
        y = paragraph(canvas, conclusion, LEFT + 24, y, "body", W - 24) - 17
    canvas.setStrokeColor(LINE)
    canvas.line(LEFT, y, LEFT + W, y)
    label(canvas, "REFERENCIAS CONSULTADAS", LEFT, y - 20, color=NAVY)
    y -= 34
    for key in document["sources"]:
        source = CATALOG["sources"][key]
        address = escape(source["url"], {'"': '&quot;'})
        y = paragraph(canvas, f'<link href="{address}">{escape(source["name"])}</link>', LEFT, y, "link", markup=True) - 3
        y = paragraph(canvas, source["url"], LEFT, y, "small") - 16
    y = paragraph(canvas, f"Fuentes verificadas el {UPDATED}. Los datos de todos los casos son ficticios y las referencias explican el contexto de los conceptos.", LEFT, y - 7, "body")
    assert y >= 70
    canvas.showPage()


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    COVERS.mkdir(parents=True, exist_ok=True)
    for doc in CATALOG["documents"]:
        path = DEST / f"{doc['slug']}.pdf"
        canvas = Canvas(str(path), pagesize=A4, lang="es", pageCompression=1)
        canvas.setTitle(doc["title"])
        canvas.setAuthor("Arkez Invest")
        canvas.setSubject(doc["subtitle"])
        cover(canvas, doc)
        contents(canvas, doc)
        for chapter in doc["chapters"]:
            chapter_page(canvas, doc, chapter)
        conclusions(canvas, doc)
        canvas.save()
        with fitz.open(path) as result:
            pixmap = result[0].get_pixmap(matrix=fitz.Matrix(.52, .52), alpha=False)
            Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples).save(COVERS / f"{doc['slug']}.webp", quality=87)


if __name__ == "__main__":
    main()
