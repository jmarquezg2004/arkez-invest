"""Generate the seven AI-chain sheets and two complementary business worksheets."""
import io
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab import rl_config
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from PIL import Image
from reportlab.platypus import Paragraph
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public/recursos/archivos"
NAVY, GOLD, PAPER = map(HexColor, ("#102640", "#E9BE6B", "#F8F5ED"))
os.environ["SOURCE_DATE_EPOCH"] = "1795651200"
rl_config.useA85 = 0
FONT_DIR = Path(os.environ.get("ARKEZ_PDF_FONTS", "/usr/share/fonts/truetype/dejavu"))
for name, file in (("ArkezSans", "DejaVuSans.ttf"), ("ArkezSansBold", "DejaVuSans-Bold.ttf"), ("ArkezSerif", "DejaVuSerif-Bold.ttf")):
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))

def page(path, title, label, art, parts, source, worksheet=False):
    canvas = Canvas(str(path), pagesize=A4, invariant=1, lang="es")
    canvas.setTitle(title)
    canvas.setAuthor("Arkez Invest")
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(NAVY)
    canvas.rect(0, height - 205, width, 205, fill=1, stroke=0)
    image = Image.open(ROOT / "arkez-visual-engine/assets" / f"{art}.webp").convert("RGB")
    image.thumbnail((640, 400))
    jpeg = io.BytesIO()
    image.save(jpeg, format="JPEG", quality=84, optimize=True)
    jpeg.seek(0)
    canvas.drawImage(ImageReader(jpeg), 318, height-205, width=width-318, height=205, preserveAspectRatio=True, anchor="c")
    canvas.setFillColor(GOLD)
    canvas.setFont("ArkezSansBold", 10)
    canvas.drawString(49, height - 55, "ARKEZ RESEARCH   /   " + label.upper())
    t = Paragraph(escape(title), ParagraphStyle("Title", fontName="ArkezSerif", fontSize=33, leading=35, textColor=white))
    _, th = t.wrap(260, 120)
    t.drawOn(canvas, 49, height - 84 - th)
    y = height - 241
    for heading, body in parts:
        canvas.setFillColor(NAVY)
        canvas.setFont("ArkezSansBold", 12)
        canvas.drawString(49, y, heading)
        p = Paragraph(escape(body), ParagraphStyle("Text", fontName="ArkezSans", fontSize=11, leading=16, textColor=NAVY))
        _, ph = p.wrap(width-98, 140)
        p.drawOn(canvas, 49, y - ph - 9)
        y -= ph + 37
    if worksheet:
        canvas.setStrokeColor(HexColor("#9DA8B6"))
        for _ in range(5):
            canvas.line(49, y, width-49, y)
            y -= 21
    assert y > 104
    link = Paragraph('<link href="' + escape(source, {'"': '&quot;'}) + '"><u>Consultar la fuente de referencia</u></link>',
                     ParagraphStyle("Link", fontName="ArkezSansBold", fontSize=10, leading=14, textColor=NAVY))
    link.wrap(width-98, 42)
    link.drawOn(canvas, 49, 75)
    canvas.setFont("ArkezSans", 9)
    canvas.drawString(49, 48, "Material educativo   •   Ejemplos ilustrativos   •   Arkez Invest")
    canvas.showPage()
    canvas.save()

stages = json.loads((ROOT / "arkez-visual-engine/ai-stages.json").read_text())
folder = DEST / "cadena-ia"
folder.mkdir(exist_ok=True)
for number, stage in enumerate(stages, 1):
    page(folder / f"etapa-ia-{number}.pdf", stage["title"], f"Etapa {number} de 7", stage["art"], [
        ("Qué hace", stage["detail"]), ("Qué aporta", stage["output"]),
        ("Caso para entenderlo", stage["example"]), ("Pregunta de repaso", stage["question"]),
    ], stage["source"], True)

page(DEST / "nubank-cuaderno-modelo.pdf", "Nubank · Cuaderno de análisis", "Hoja de trabajo", "bank", [
    ("1. Clasifica el dinero", "En el informe anual, separa depósitos, ingresos por intereses y comisiones. Escribe qué representa cada concepto y en qué estado financiero lo encontraste."),
    ("2. Mide el margen", "Calcula beneficio bruto dividido entre ingresos para 2024 y 2025. Anota los valores en USD, sus unidades y la página del informe."),
    ("3. Contrasta tu explicación", "Identifica dos costos capaces de cambiar el margen. Escribe qué evidencia confirmaría tu hipótesis y qué dato podría refutarla."),
], "https://www.sec.gov/Archives/edgar/data/1691493/000129281426002166/nuform20f_2025.htm", True)
page(DEST / "oddity-cuaderno-modelo.pdf", "ODDITY · Cuaderno de análisis", "Hoja de trabajo", "report", [
    ("1. Sigue al cliente", "Dibuja el recorrido desde que una persona descubre una marca hasta que compra o devuelve el producto. Identifica dos posibles costos de ese recorrido."),
    ("2. Evalúa la adquisición", "Ejemplo ficticio. Una marca gasta USD 600 y obtiene 40 primeras compras. Calcula el costo por cliente. Vuelve a calcularlo si solo obtiene 30."),
    ("3. Comprueba una hipótesis", "¿Qué cambiaría si más clientes repitieran compra? Escribe qué buscarías en el informe anual y cómo distinguirías una cifra publicada de una estimación."),
], "https://www.sec.gov/Archives/edgar/data/1907085/000110465926029490/odd-20251231x20f.htm", True)
