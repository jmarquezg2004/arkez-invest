import type { StaticImageData } from "next/image";
import objetivo from "./illustrations/objetivo.webp";
import fecha from "./illustrations/fecha.webp";
import perdida from "./illustrations/perdida.webp";
import costos from "./illustrations/costos.webp";
import contrastar from "./illustrations/contrastar.webp";
import matricula from "./illustrations/matricula.webp";
import escenarios from "./illustrations/escenarios.webp";
import caja_operativa from "./illustrations/caja-operativa.webp";
import fuente_fecha from "./illustrations/fuente-fecha.webp";
import compuesto from "./illustrations/compuesto.webp";
import dos_lentes from "./illustrations/dos-lentes.webp";
import canastas from "./illustrations/canastas.webp";
import dependencia from "./illustrations/dependencia.webp";
import barcos from "./illustrations/barcos.webp";
import hechos from "./illustrations/hechos.webp";
import barras from "./illustrations/barras.webp";
import fabrica from "./illustrations/fabrica.webp";
import dato_faltante from "./illustrations/dato-faltante.webp";
import escenario_base from "./illustrations/escenario-base.webp";
import un_supuesto from "./illustrations/un-supuesto.webp";
import dos_calendarios from "./illustrations/dos-calendarios.webp";
import explicar_equipo from "./illustrations/explicar-equipo.webp";
import dimensiones from "./illustrations/dimensiones.webp";
import tormenta from "./illustrations/tormenta.webp";
import balance from "./illustrations/balance.webp";
import volatilidad from "./illustrations/volatilidad.webp";
import frecuencia from "./illustrations/frecuencia.webp";
import fundamentos from "./illustrations/fundamentos.webp";
import instrumentos from "./illustrations/instrumentos.webp";
import titulares from "./illustrations/titulares.webp";
import taller from "./illustrations/taller.webp";
import presupuesto from "./illustrations/presupuesto.webp";
import financiacion from "./illustrations/financiacion.webp";
import relacion from "./illustrations/relacion.webp";
import hipotesis from "./illustrations/hipotesis.webp";
import registro from "./illustrations/registro.webp";
import custodia from "./illustrations/custodia.webp";
import metodologia from "./illustrations/metodologia.webp";

type Scene = [image: StaticImageData, x: number, y: number];

const scenes: Record<string, Record<string, Scene>> = {
  "/recursos/guias/primeros-pasos/": {
    "0": [objetivo, 58, 76],
    "1": [fecha, 70, 58],
    "2": [perdida, 48, 77],
    "3": [costos, 59, 72],
    "4": [contrastar, 58, 60],
    "5": [matricula, 58, 68],
  },
  "/recursos/guias/": {
    "0": [escenarios, 53, 71],
    "1": [caja_operativa, 65, 71],
    "1.0": [escenario_base, 54, 74],
    "1.1": [un_supuesto, 69, 53],
    "1.2": [dos_calendarios, 71, 43],
    "1.3": [explicar_equipo, 53, 51],
    "2": [fuente_fecha, 66, 53],
  },
  "/recursos/articulos/": {
    "0": [dos_lentes, 63, 47],
    "0.0": [hechos, 57, 47],
    "0.1": [barras, 72, 45],
    "0.2": [fabrica, 70, 55],
    "0.3": [dato_faltante, 67, 62],
    "1": [canastas, 59, 73],
  },
  "/recursos/articulos/que-es-diversificar/": {
    "0": [dependencia, 55, 69],
    "1": [dimensiones, 62, 58],
    "2": [tormenta, 62, 47],
  },
  "/legal/riesgos/": {
    "0": [volatilidad, 62, 50],
    "1": [balance, 54, 56],
    "2": [custodia, 62, 62],
    "3": [barcos, 64, 60],
  },
  "/herramientas/interes-compuesto/": {
    "0": [compuesto, 63, 66],
    "1": [frecuencia, 68, 62],
  },
  "/servicios/educacion-financiera/": {
    "0": [fundamentos, 58, 54],
    "1": [instrumentos, 59, 57],
    "2": [titulares, 63, 60],
    "3": [taller, 60, 48],
    "4": [presupuesto, 64, 63],
    "6": [financiacion, 64, 65],
  },
  "/servicios/metodologia/": {
    "0": [metodologia, 64, 60],
  },
};
export const workshopArt: readonly Scene[] = [
  [relacion, 59, 63],
  [hipotesis, 60, 60],
  [registro, 59, 57],
];

export function lessonArtwork(path: string) {
  return scenes[path];
}
