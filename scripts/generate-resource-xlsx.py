"""Build the editable Arkez workbook and its library cover."""
import argparse
from datetime import datetime
from pathlib import Path

import fitz
import xlsxwriter
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FILES = ROOT / "public/recursos/archivos"
COVERS = ROOT / "public/recursos/portadas"
WORKBOOK = FILES / "laboratorio-financiero.xlsx"
NAVY, INK, GOLD = "#0D1E35", "#233B55", "#E6C376"
BLUE, CREAM, LINE = "#E9F3FC", "#FCF2DA", "#D5DEE7"
MONEY, PERCENT = '"USD " #,##0.00;[Red]("USD " #,##0.00);"-"', '0.00%;[Red](0.00%);0.00%'


def create_workbook():
    FILES.mkdir(parents=True, exist_ok=True)
    with xlsxwriter.Workbook(WORKBOOK, {"strings_to_formulas": False, "strings_to_urls": False}) as book:
        book.set_properties({"title": "Laboratorio financiero de Arkez Invest", "author": "Arkez Invest",
                             "comments": "Ejercicios ficticios y hojas de trabajo en USD.",
                             "created": datetime(2026, 11, 20)})
        book.set_calc_mode("auto")
        bold = book.add_format({"bold": True, "font_color": NAVY, "bg_color": GOLD, "valign": "vcenter"})
        title = book.add_format({"font_size": 19, "bold": True, "font_color": "#FFFFFF", "bg_color": NAVY, "valign": "vcenter"})
        note = book.add_format({"font_color": INK, "text_wrap": True, "valign": "vcenter"})
        status = book.add_format({"font_color": "#8B231A", "bg_color": "#FBE6E4", "bold": True})
        formats = {}
        for group, color in (("example", CREAM), ("own", BLUE), ("result", "#F2F5F8")):
            for unit, number in (("text", None), ("money", MONEY), ("pct", PERCENT), ("qty", "0.000000")):
                values = {"bg_color": color, "font_color": NAVY, "bottom": 1, "bottom_color": LINE}
                if number:
                    values["num_format"] = number
                formats[group, unit] = book.add_format(values)

        def sheet(name, subtitle, widths):
            ws = book.add_worksheet(name)
            ws.hide_gridlines(2)
            ws.set_tab_color(GOLD if name in ("Instrucciones", "Dashboard") else NAVY)
            for column, width in enumerate(widths):
                ws.set_column(column, column, width)
            ws.set_row(0, 33)
            ws.merge_range(0, 0, 0, len(widths) - 1, f"Arkez Invest | {name}", title)
            ws.set_row(1, 29)
            ws.merge_range(1, 0, 1, len(widths) - 1, subtitle, note)
            ws.set_landscape()
            ws.fit_to_pages(1, 1)
            ws.set_paper(9)
            return ws

        def filled(ws, row, column, value, group, kind="money"):
            style = formats[group, kind]
            ws.write_blank(row - 1, column, None, style) if value is None else ws.write(row - 1, column, value, style)

        def formula(ws, row, column, expression, value="", kind="money"):
            ws.write_formula(row - 1, column, expression, formats["result", kind], value)

        def block(ws, row, label, headers):
            ws.merge_range(row - 1, 0, row - 1, len(headers) - 1, label, bold)
            ws.add_table(row, 0, row + (6 if ws.name == "Presupuesto" else 3), len(headers) - 1, {
                "style": "Table Style Light 9", "columns": [{"header": header} for header in headers],
            })

        def decimal(ws, cells, minimum=0, maximum=1_000_000_000_000):
            ws.data_validation(cells, {
                "validate": "decimal", "criteria": "between", "minimum": minimum, "maximum": maximum,
                "input_title": "Importe o porcentaje", "input_message": "Introduce un valor dentro del rango indicado.",
                "error_type": "stop", "error_title": "Valor fuera de rango",
                "error_message": f"Introduce un número entre {minimum:g} y {maximum:g}.",
            })

        def warn(ws, cells):
            ws.conditional_format(cells, {"type": "cell", "criteria": "<", "value": 0, "format": status})

        instructions = sheet("Instrucciones", "Edición 20/11/2026 · Unidades USD · Material educativo", [27, 37, 37, 30])
        instructions.merge_range("A4:D4", "Código de color", bold)
        instructions.write("A5", "Ejemplo ficticio", formats["example", "text"])
        instructions.write("B5", "Campo propio editable", formats["own", "text"])
        instructions.write("C5", "Resultado calculado", formats["result", "text"])
        notes = [
            ("Empieza con una copia", "Revisa las filas ficticias antes de registrar tus cifras. Los bloques azules quedan vacíos. Conserva los importes en USD y el mismo período al comparar escenarios."),
            ("Presupuesto", "Introduce el saldo inicial en el primer mes. Completa cobros y pagos de cada mes, incluso con 0 si no hubo movimiento. Cada saldo alimenta el siguiente período."),
            ("Escenarios", "Completa un caso base y cambia un solo supuesto por alternativa. El ejemplo de cobro retrasado pasa de USD 600 a USD -250."),
            ("Inversiones", "Anota cantidad, precios de entrada y salida, y costos. El resultado supone que se vende toda la posición. No incluye dividendos, impuestos ni ajuste por inflación."),
            ("Riesgo", "Agrega el valor y el cambio hipotético por posición. Un -15 % se escribe como -15%. El impacto agregado sólo aparece al completar cada posición con valor positivo."),
            ("Dashboard", "Usa el selector en B4 para alternar entre ejemplos y datos propios. Los indicadores y las series se recalculan desde sus hojas. Los espacios sin entradas no representan resultados."),
            ("Alcance", "Cifras ficticias; no son recomendaciones ni estimaciones de rendimiento. El archivo no usa macros ni conexiones externas. Mantén tus archivos con datos propios fuera de canales públicos."),
        ]
        for index, (label, body) in enumerate(notes, start=7):
            instructions.set_row(index - 1, 37)
            instructions.write(index - 1, 0, label, bold)
            instructions.merge_range(index - 1, 1, index - 1, 3, body, note)
        for index, name in enumerate(("Presupuesto", "Escenarios", "Inversiones", "Riesgo", "Dashboard"), start=15):
            instructions.write_url(f"A{index}", f"internal:{name}!A1", string=f"Abrir {name}")

        cash = sheet("Presupuesto", "Flujo mensual de caja. Captura cobros y pagos como importes positivos.", [15, 19, 19, 19, 19, 19, 18])
        cash.freeze_panes(6, 1)
        cash_examples = [(1200, 1500), (1600, 1350), (1100, 1300), (1500, 1400), (1750, 1500), (1700, 1400)]
        cash_results = []
        for start, kind in ((7, "example"), (16, "own")):
            block(cash, start - 2, "EJEMPLO FICTICIO" if kind == "example" else "MIS DATOS", ["Mes", "Saldo inicial", "Cobros", "Pagos", "Flujo neto", "Saldo final", "Flujo / cobros"])
            balance = 900
            for i, (income, expense) in enumerate(cash_examples):
                row = start + i
                example = kind == "example"
                filled(cash, row, 0, f"Mes {i + 1}", kind, "text")
                if i == 0:
                    filled(cash, row, 1, balance if example else None, kind)
                else:
                    formula(cash, row, 1, f'=IF(COUNT(F{row-1})=1,F{row-1},"")', balance if example else "")
                filled(cash, row, 2, income if example else None, kind)
                filled(cash, row, 3, expense if example else None, kind)
                net = income - expense
                balance += net
                formula(cash, row, 4, f'=IF(COUNT(C{row}:D{row})=2,C{row}-D{row},"")', net if example else "")
                formula(cash, row, 5, f'=IF(COUNT(B{row},E{row})=2,B{row}+E{row},"")', balance if example else "")
                formula(cash, row, 6, f'=IF(COUNT(C{row},E{row})<2,"",IF(C{row}=0,"",E{row}/C{row}))', net / income if example else "", "pct")
                if example:
                    cash_results.append(balance)
            decimal(cash, f"B{start}", -1_000_000_000_000)
            decimal(cash, f"C{start}:D{start+5}")
            warn(cash, f"E{start}:F{start+5}")

        scenes = sheet("Escenarios", "Conserva la misma unidad y cambia una variable por escenario.", [25, 19, 19, 19, 20, 21, 20])
        scenes.freeze_panes(6, 1)
        scene_examples = [("Base", 900, 1200, 1500), ("Retraso de cobro", 900, 350, 1500), ("Aumento de pagos", 900, 1200, 1800)]
        scene_results = []
        for start, kind in ((7, "example"), (16, "own")):
            block(scenes, start - 2, "EJEMPLO FICTICIO" if kind == "example" else "MIS DATOS", ["Escenario", "Saldo inicial", "Cobros", "Pagos", "Saldo final", "Cambio frente a base", "Estado"])
            for i, (name, balance, income, expense) in enumerate(scene_examples):
                row = start + i
                example = kind == "example"
                for column, value in enumerate((name if example else ("Mi caso base" if i == 0 else f"Alternativo {i}"), balance, income, expense)):
                    filled(scenes, row, column, value if column == 0 or example else None, kind, "text" if column == 0 else "money")
                end = balance + income - expense
                formula(scenes, row, 4, f'=IF(COUNT(B{row}:D{row})=3,SUM(B{row}:C{row})-D{row},"")', end if example else "")
                formula(scenes, row, 5, f'=IF(COUNT(E{row},$E${start})=2,E{row}-$E${start},"")', end - 600 if example else "")
                formula(scenes, row, 6, f'=IF(COUNT(E{row})=0,"",IF(E{row}<0,"Brecha","Cubierto"))', ("Brecha" if end < 0 else "Cubierto") if example else "", "text")
                if example:
                    scene_results.append(end)
            decimal(scenes, f"B{start}:B{start+2}", -1_000_000_000_000)
            decimal(scenes, f"C{start}:D{start+2}")
            warn(scenes, f"E{start}:F{start+2}")

        investment = sheet("Inversiones", "Ejercicio sobre resultado neto de una salida total. Cantidades fraccionarias admitidas.", [18, 13, 15, 15, 18, 18, 19, 19, 18, 17])
        investment.freeze_panes(6, 1)
        investment_examples = [("Acción", 10, 100, 109, 5, 5), ("ETF", 5, 100, 97, 2, 2), ("Criptoactivo", .5, 2000, 1300, 0, 10)]
        for start, kind in ((7, "example"), (16, "own")):
            block(investment, start - 2, "EJEMPLO FICTICIO" if kind == "example" else "MIS DATOS", ["Instrumento", "Cantidad", "Precio entrada", "Precio salida", "Costo entrada", "Costo salida", "Inversión total", "Salida neta", "Resultado neto", "Resultado %"])
            for i, inputs in enumerate(investment_examples):
                row = start + i
                example = kind == "example"
                for column, value in enumerate(inputs):
                    units = {0: "text", 1: "qty"}
                    filled(investment, row, column, value if example else None, kind, units.get(column, "money"))
                _, quantity, price_in, price_out, fee_in, fee_out = inputs
                invested, sale = quantity * price_in + fee_in, quantity * price_out - fee_out
                for column, expression, cached in [
                    (6, f'=IF(COUNT(B{row},C{row},E{row})=3,B{row}*C{row}+E{row},"")', invested),
                    (7, f'=IF(COUNT(B{row},D{row},F{row})=3,B{row}*D{row}-F{row},"")', sale),
                    (8, f'=IF(COUNT(G{row}:H{row})=2,H{row}-G{row},"")', sale - invested),
                    (9, f'=IF(COUNT(G{row},I{row})<2,"",IF(G{row}<=0,"",I{row}/G{row}))', (sale - invested) / invested),
                ]:
                    formula(investment, row, column, expression, cached if example else "", "pct" if column == 9 else "money")
            investment.data_validation(f"A{start}:A{start+2}", {"validate": "list", "source": ["Acción", "ETF", "Criptoactivo"]})
            decimal(investment, f"B{start}:B{start+2}", .000001, 1_000_000)
            decimal(investment, f"C{start}:F{start+2}")
            warn(investment, f"I{start}:J{start+2}")

        risk = sheet("Riesgo", "Peso e impacto por posición en un escenario hipotético. Uso formativo.", [22, 20, 21, 19, 21, 20])
        risk.freeze_panes(6, 1)
        risk_examples = [("Acciones", 400, -.15), ("ETF", 500, -.08), ("Criptoactivos", 100, -.40)]
        for start, kind in ((7, "example"), (16, "own")):
            end = start + 2
            block(risk, start - 2, "EJEMPLO FICTICIO" if kind == "example" else "MIS DATOS", ["Posición", "Valor de partida", "Cambio supuesto", "Peso", "Aporte al impacto", "Impacto USD"])
            for i, (name, value, shock) in enumerate(risk_examples):
                row = start + i
                example = kind == "example"
                filled(risk, row, 0, name if example else None, kind, "text")
                filled(risk, row, 1, value if example else None, kind)
                filled(risk, row, 2, shock if example else None, kind, "pct")
                formula(risk, row, 3, f'=IF(COUNT(B{row})=0,"",IF(SUM($B${start}:$B${end})>0,B{row}/SUM($B${start}:$B${end}),""))', value / 1000 if example else "", "pct")
                formula(risk, row, 4, f'=IF(COUNT(C{row}:D{row})=2,C{row}*D{row},"")', shock * value / 1000 if example else "", "pct")
                formula(risk, row, 5, f'=IF(COUNT(B{row}:C{row})=2,B{row}*C{row},"")', shock * value if example else "")
            total = end + 1
            risk.write(f"A{total}", "Total / impacto", bold)
            formula(risk, total, 1, f'=IF(COUNT(B{start}:B{end})=0,"",SUM(B{start}:B{end}))', 1000 if kind == "example" else "")
            for column, letter, value, unit in ((3, "D", 1, "pct"), (4, "E", -.14, "pct"), (5, "F", -140, "money")):
                span = f"{letter}{start}:{letter}{end}"
                expression = f'=IF(COUNT({span})=0,"",IF(COUNT({span})=COUNT(B{start}:B{end}),SUM({span}),""))'
                formula(risk, total, column, expression, value if kind == "example" else "", unit)
            decimal(risk, f"B{start}:B{end}", .01)
            decimal(risk, f"C{start}:C{end}", -1, 10)
            warn(risk, f"E{start}:F{total}")

        dashboard = sheet("Dashboard", "Cambia B4. Los gráficos usan rangos vinculados y se actualizan al modificar los datos.", [25] + [12] * 14)
        dashboard.write("A4", "Conjunto de datos", bold)
        filled(dashboard, 4, 1, "Ejemplos", "own", "text")
        dashboard.data_validation("B4", {"validate": "list", "source": ["Ejemplos", "Mis datos"]})
        dashboard.set_column("Q:X", 19, None, {"hidden": True})

        def dashboard_value(row, column, example, own, cache, kind="money"):
            formula(dashboard, row, column, f'=IF($B$4="Ejemplos",IF(COUNT({example})=1,{example},""),IF(COUNT({own})=1,{own},""))', cache, kind)

        for row, label, example, own, value, kind in [
            (7, "Caja final", "Presupuesto!F12", "Presupuesto!F21", cash_results[-1], "money"),
            (8, "Cambio del alternativo 1", "Escenarios!F8", "Escenarios!F17", -850, "money"),
            (9, "Impacto ponderado", "Riesgo!E10", "Riesgo!E19", -.14, "pct"),
            (10, "Resultado inversión 1", "Inversiones!I7", "Inversiones!I16", 80, "money"),
        ]:
            dashboard.write(row - 1, 0, label, bold)
            dashboard_value(row, 1, example, own, value, kind)
        dashboard.merge_range("A12:M12", "Las series sin datos propios completados aún no representan valores aplicables.", note)

        for index, amount in enumerate(cash_results):
            row = index + 2
            dashboard.write(f"Q{row}", f"Mes {index + 1}")
            dashboard_value(row, 17, f"Presupuesto!F{index+7}", f"Presupuesto!F{index+16}", amount)
        for index, amount in enumerate(scene_results):
            row = index + 2
            dashboard.write(f"S{row}", ("Base", "Alternativo 1", "Alternativo 2")[index])
            dashboard_value(row, 19, f"Escenarios!E{index+7}", f"Escenarios!E{index+16}", amount)
        for index, (name, amount, _) in enumerate(risk_examples):
            row = index + 2
            own_name = f"Riesgo!A{index+16}"
            formula(dashboard, row, 20, f'=IF($B$4="Ejemplos",Riesgo!A{index+7},IF({own_name}="","Posición {index+1}",{own_name}))', name, "text")
            dashboard_value(row, 21, f"Riesgo!D{index+7}", f"Riesgo!D{index+16}", amount / 1000, "pct")
        for index, (name, quantity, before, after, entry, exit_fee) in enumerate(investment_examples):
            row = index + 2
            own_name = f"Inversiones!A{index+16}"
            formula(dashboard, row, 22, f'=IF($B$4="Ejemplos",Inversiones!A{index+7},IF({own_name}="","Instrumento {index+1}",{own_name}))', name, "text")
            initial = quantity * before + entry
            result = (quantity * after - exit_fee - initial) / initial
            dashboard_value(row, 23, f"Inversiones!J{index+7}", f"Inversiones!J{index+16}", result, "pct")
        for chart_type, cell, heading, categories, values, unit in [
            ("line", "A14", "Saldo final por mes", "$Q$2:$Q$7", "$R$2:$R$7", MONEY),
            ("column", "G14", "Saldo según escenario", "$S$2:$S$4", "$T$2:$T$4", MONEY),
            ("bar", "A30", "Peso por posición", "$U$2:$U$4", "$V$2:$V$4", PERCENT),
            ("column", "G30", "Resultado neto por instrumento (%)", "$W$2:$W$4", "$X$2:$X$4", PERCENT),
        ]:
            chart = book.add_chart({"type": chart_type})
            chart.add_series({"categories": f"=Dashboard!{categories}", "values": f"=Dashboard!{values}",
                              "fill": {"color": GOLD}, "line": {"color": INK}})
            chart.set_title({"name": heading, "name_font": {"color": NAVY}})
            chart.set_legend({"none": True})
            (chart.set_x_axis if chart_type == "bar" else chart.set_y_axis)({"num_format": unit})
            chart.set_size({"width": 510, "height": 280})
            chart.show_hidden_data()
            chart.show_blanks_as("gap")
            dashboard.insert_chart(cell, chart)


def create_cover():
    COVERS.mkdir(parents=True, exist_ok=True)
    image = Image.new("RGB", (310, 438), NAVY)
    draw = ImageDraw.Draw(image)
    logo = Image.open(ROOT / "public/brand/logo.png").convert("RGBA")
    logo.thumbnail((124, 48))
    draw.rounded_rectangle((26, 28, 181, 91), 5, fill="white")
    image.paste(logo, (40, 36), logo)
    draw.rectangle((26, 122, 63, 125), fill=GOLD)
    bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    draw.text((26, 141), "LIBRO DE TRABAJO", font=ImageFont.truetype(bold, 13), fill=GOLD)
    draw.multiline_text((26, 181), "Laboratorio\nfinanciero", font=ImageFont.truetype(bold, 31), fill="white", spacing=5)
    for index, height in enumerate((24, 39, 31, 53, 64)):
        x = 28 + index * 42
        draw.rectangle((x, 365 - height, x + 23, 365), fill=GOLD if index == 4 else "#86A7CA")
    draw.text((26, 398), "XLSX  ·  6 hojas", font=ImageFont.truetype(bold, 13), fill="white")
    image.save(COVERS / "laboratorio-financiero.webp", quality=88)


def create_dashboard_preview(pdf):
    with fitz.open(pdf) as document:
        page = next(page for page in document if "Arkez Invest | Dashboard" in page.get_text())
        pixmap = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
    bounds = ImageChops.difference(image, Image.new("RGB", image.size, "white")).getbbox()
    image = image.crop(bounds)
    image.thumbnail((950, 650))
    frame = Image.new("RGB", (970, 670), "white")
    frame.paste(image, ((970 - image.width) // 2, (670 - image.height) // 2))
    frame.save(COVERS / "vista-dashboard.webp", quality=91)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dashboard-pdf", type=Path, help="Calc PDF export of the generated workbook.")
    args = parser.parse_args()
    if args.dashboard_pdf:
        create_dashboard_preview(args.dashboard_pdf)
    else:
        create_workbook()
        create_cover()
