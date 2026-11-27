import type { StaticImageData } from "next/image";
import type { BeginnerTopic } from "../learning-path";
import bolsa from "./escenas/bolsa.webp";
import cripto from "./escenas/cripto.webp";
import venture from "./escenas/venture.webp";
import fondos from "./escenas/fondos.webp";
import inmuebles from "./escenas/inmuebles.webp";
import depositos from "./escenas/depositos.webp";
import cuentas from "./escenas/cuentas.webp";
import fiduciarios from "./escenas/fiduciarios.webp";
import pensiones from "./escenas/pensiones.webp";
import privado from "./escenas/privado.webp";
import crowdfunding from "./escenas/crowdfunding.webp";
import ahorro from "./escenas/ahorro.webp";
import riesgo from "./escenas/riesgo.webp";
import consumo from "./escenas/consumo.webp";
import banca from "./escenas/banca.webp";
import inmueble from "./escenas/inmueble.webp";
import mercados from "./escenas/mercados.webp";
import registro from "./escenas/registro.webp";
import ia from "./escenas/ia.webp";
import liquidez from "./escenas/liquidez.webp";
import volumen from "./escenas/volumen.webp";
import liquidez_mercado from "./escenas/liquidez-mercado.webp";
import precio from "./escenas/precio.webp";
import sma from "./escenas/sma.webp";
import per from "./escenas/per.webp";
import roic from "./escenas/roic.webp";
import peg from "./escenas/peg.webp";
import weinstein from "./escenas/weinstein.webp";

export const topicArt = {
  bolsa,
  cripto,
  venture,
  fondos,
  inmuebles,
  depositos,
  cuentas,
  fiduciarios,
  pensiones,
  privado,
  crowdfunding,
  ahorro,
  riesgo,
  consumo,
  banca,
  inmueble,
  mercados,
  registro,
  ia,
  liquidez,
} satisfies Record<BeginnerTopic, StaticImageData>;

export const indicatorArt = {
  volumen,
  liquidez: liquidez_mercado,
  precio,
  sma,
  per,
  roic,
  peg,
  weinstein,
};
