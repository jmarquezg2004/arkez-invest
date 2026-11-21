export function projectProperty({ price, expenses, annualChange }: { price: number; expenses: number; annualChange: number }) {
  const years = 5;
  const future = price * (1 + annualChange / 100) ** years;
  const operating = expenses * years * 12;
  return { years, future, operating, difference: future - price - operating };
}
