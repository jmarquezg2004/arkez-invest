"""Verify the published PDF layout and workbook with an independent calculation engine."""
from collections import Counter
from math import isclose
from pathlib import Path
from subprocess import run
from tempfile import TemporaryDirectory
from xml.etree import ElementTree
from zipfile import ZipFile

import fitz
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
FILES = ROOT / "public/recursos/archivos"
WORKBOOK = FILES / "laboratorio-financiero.xlsx"


def recalculate(path, destination, temporary):
    destination.mkdir()
    run(["soffice", f"-env:UserInstallation={temporary.joinpath('office').as_uri()}",
         "--headless", "--convert-to", "xlsx", "--outdir", str(destination), str(path)], check=True)
    return load_workbook(destination / path.name, data_only=True)


def render_dashboard(path, destination, temporary):
    destination.mkdir()
    run(["soffice", f"-env:UserInstallation={temporary.joinpath('office').as_uri()}",
         "--headless", "--convert-to", "pdf", "--outdir", str(destination), str(path)], check=True)
    with fitz.open(destination / f"{path.stem}.pdf") as document:
        dashboard = next(page for page in document if "Arkez Invest | Dashboard" in page.get_text())
        assert all(caption in dashboard.get_text() for caption in (
            "Saldo final por mes", "Saldo según escenario", "Peso por posición", "Resultado neto por instrumento",
        ))
        area = dashboard.rect
        return dashboard.get_pixmap(clip=fitz.Rect(0, area.height * .27, area.width, area.height)).samples


def equal(expected, actual):
    if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
        return isclose(expected, actual, rel_tol=1e-10, abs_tol=1e-9)
    return expected == actual or expected in ("", None) and actual in ("", None)


def workbook_quality(temporary):
    source = load_workbook(WORKBOOK)
    assert source.sheetnames == ["Instrucciones", "Presupuesto", "Escenarios", "Inversiones", "Riesgo", "Dashboard"]
    assert source.calculation.calcMode in (None, "auto") and source.calculation.fullCalcOnLoad
    stored = load_workbook(WORKBOOK, data_only=True)
    computed = recalculate(WORKBOOK, temporary / "baseline", temporary)
    count = 0
    for worksheet in source:
        for row in worksheet.iter_rows():
            for cell in row:
                if cell.data_type != "f":
                    continue
                original = stored[worksheet.title][cell.coordinate]
                actual = computed[worksheet.title][cell.coordinate]
                assert actual.data_type != "e" and equal(original.value, actual.value), (worksheet.title, cell.coordinate, original.value, actual.value)
                count += 1
    assert count == 139
    assert source["Dashboard"].data_validations.count == 1
    for name in ("Presupuesto", "Escenarios", "Inversiones", "Riesgo"):
        assert len(source[name].tables) == 2 and source[name].data_validations.count >= 4

    series = []
    with ZipFile(WORKBOOK) as package:
        assert package.testzip() is None
        assert not any("externalLink" in filename or "vbaProject" in filename for filename in package.namelist())
        for file in sorted(name for name in package.namelist() if name.startswith("xl/charts/chart") and name.endswith(".xml")):
            chart = ElementTree.fromstring(package.read(file))
            ns = {"c": "http://schemas.openxmlformats.org/drawingml/2006/chart"}
            series.append(chart.findtext(".//c:ser/c:val/c:numRef/c:f", namespaces=ns))
            visible = chart.find(".//c:plotVisOnly", ns)
            assert visible is None or visible.get("val") == "0"
    assert series == ["Dashboard!$R$2:$R$7", "Dashboard!$T$2:$T$4", "Dashboard!$V$2:$V$4", "Dashboard!$X$2:$X$4"]

    source["Presupuesto"]["C7"] = 1400
    source["Escenarios"]["C8"] = 800
    source["Inversiones"]["D7"] = 120
    source["Riesgo"]["B7"] = 500
    path = temporary / "modified.xlsx"
    source.save(path)
    changed = recalculate(path, temporary / "examples", temporary)
    assert render_dashboard(WORKBOOK, temporary / "baseline-pdf", temporary) != render_dashboard(path, temporary / "modified-pdf", temporary)
    dash = changed["Dashboard"]
    for address, value in {"R2": 800, "R7": 1500, "T3": 200, "V2": 500 / 1100, "X2": 190 / 1005}.items():
        assert equal(value, dash[address].value), (address, value, dash[address].value)

    source["Dashboard"]["B4"] = "Mis datos"
    user_values = {
        "Presupuesto": {"B16": 1000, "C16": 100, "D16": 150, "C17": 0, "D17": 0},
        "Escenarios": {"B16": 1000, "C16": 500, "D16": 700, "B17": 1000, "C17": 250, "D17": 700},
        "Inversiones": {"A16": "ETF", "B16": 2, "C16": 100, "D16": 110, "E16": 2, "F16": 1},
        "Riesgo": {"A16": "Posición A", "B16": 200, "C16": -.1, "A17": "Posición B", "B17": 300, "C17": -.2},
    }
    for name, entries in user_values.items():
        for cell, value in entries.items():
            source[name][cell] = value
    path = temporary / "own.xlsx"
    source.save(path)
    own = recalculate(path, temporary / "own", temporary)
    dash = own["Dashboard"]
    for address, value in {"R2": 950, "R3": 950, "T2": 800, "T3": 550, "V2": .4, "V3": .6, "B8": -250, "B9": -.16, "B10": 17, "X2": 17 / 202}.items():
        assert equal(value, dash[address].value), (address, value, dash[address].value)
    assert dash["B7"].value in (None, "") and dash["R4"].value in (None, "")
    assert own["Presupuesto"]["G17"].value in (None, "")
    print(f"Excel: {count} fórmulas contrastadas; las cuatro series cambian con ejemplos y datos propios en Calc.")


def pdf_quality():
    files = sorted(FILES.glob("*.pdf"))
    assert len(files) == 3
    for file in files:
        with fitz.open(file) as doc:
            assert len(doc) == 8 and doc.metadata["author"] == "Arkez Invest"
            assert len([link for link in doc[1].get_links() if link["kind"] == fitz.LINK_GOTO]) == 6
            assert len([link for link in doc[-1].get_links() if link["kind"] == fitz.LINK_URI]) >= 3
            for index, page in enumerate(doc):
                words = page.get_text("words")
                assert len(words) >= (15 if index == 0 else 45), (file, index, len(words))
                assert all(fitz.Rect(x0, y0, x1, y1) in page.rect for x0, y0, x1, y1, *_ in words), (file, index)
                assert not Counter((word[0], word[1], word[4]) for word in words).most_common(1)[0][1] > 1
                if 2 <= index <= 6:
                    assert "SOLUCIÓN COMENTADA" in page.get_text()
                    assert len(page.get_drawings()) >= 5
    print("PDF: 24 páginas con texto dentro de márgenes físicos, índices navegables y referencias enlazadas.")


if __name__ == "__main__":
    pdf_quality()
    with TemporaryDirectory(prefix="arkez-validation-") as temporary:
        workbook_quality(Path(temporary))
