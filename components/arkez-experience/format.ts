export const number = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
export const money = new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", currencyDisplay: "code", maximumFractionDigits: 0,
});
