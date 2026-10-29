function round(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function cifrasVivienda(vivienda, rentaContrato) {
  const precio = Number(vivienda.precioCompra) || 0;
  const otros = Number(vivienda.otrosGastosCompraventa) || 0;
  const tieneInversion = vivienda.precioCompra != null || vivienda.otrosGastosCompraventa != null;
  const inversionTotal = tieneInversion ? round(precio + otros) : null;
  const renta = Number(vivienda.rentaMensual || rentaContrato) || 0;
  const rentabilidad =
    inversionTotal > 0 && renta > 0 ? round((renta * 12 * 100) / inversionTotal) : null;
  const valoracion = vivienda.valoracionActual == null ? null : Number(vivienda.valoracionActual);
  const deuda = vivienda.deudaActual == null ? null : Number(vivienda.deudaActual);
  const equity =
    valoracion == null && deuda == null ? null : round((valoracion || 0) - (deuda || 0));
  return { inversionTotal, rentabilidad, equity, rentaUsada: renta };
}

function toNum(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

module.exports = { cifrasVivienda, toNum, toDate };
