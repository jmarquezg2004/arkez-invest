export const esNumber = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
export const percent = (value: number) => `${esNumber.format(value)} %`;
