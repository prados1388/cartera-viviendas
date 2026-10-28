export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function claseResultado(n) {
  if (n > 0.004) return "ok";
  if (n < -0.004) return "ko";
  return "";
}

export function aniosDisponibles() {
  const actual = new Date().getFullYear();
  const lista = [];
  for (let y = actual - 4; y <= actual + 1; y += 1) lista.push(y);
  return lista;
}
