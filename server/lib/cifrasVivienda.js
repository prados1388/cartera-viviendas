function round(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function anioDe(fecha) {
  return new Date(fecha).getUTCFullYear();
}

function segurosAnuales(vivienda) {
  const hogar = Number(vivienda?.seguroHogar?.importe) || 0;
  const impago = Number(vivienda?.seguroImpago?.importe) || 0;
  return round(hogar + impago);
}

function gastosOperativos(gastos = [], anio, { excluirSeguro } = {}) {
  let total = 0;
  for (const g of gastos) {
    if (anioDe(g.fecha) !== anio) continue;
    if (g.categoria === "reforma") continue;
    if (excluirSeguro && g.categoria === "seguro") continue;
    total += Number(g.importe) || 0;
  }
  return round(total);
}

function cifrasVivienda(vivienda, opts = {}) {
  if (typeof opts === "number") opts = { rentaContrato: opts };
  const anio = opts.anio || new Date().getFullYear();
  const gastos = opts.gastos || [];
  const rentaContrato = opts.rentaContrato;

  const precio = Number(vivienda.precioCompra) || 0;
  const otros = Number(vivienda.otrosGastosCompraventa) || 0;
  const tieneInversion = vivienda.precioCompra != null || vivienda.otrosGastosCompraventa != null;
  const inversionTotal = tieneInversion ? round(precio + otros) : null;
  const renta = Number(vivienda.rentaMensual || rentaContrato) || 0;
  const rentaAnual = round(renta * 12);
  const seguros = segurosAnuales(vivienda);
  const operativos = gastosOperativos(gastos, anio, { excluirSeguro: seguros > 0 });
  const costesAnuales = round(seguros + operativos);
  const rentabilidadBruta =
    inversionTotal > 0 && rentaAnual > 0 ? round((rentaAnual * 100) / inversionTotal) : null;
  const rentabilidad =
    inversionTotal > 0 && (rentaAnual > 0 || costesAnuales > 0)
      ? round(((rentaAnual - costesAnuales) * 100) / inversionTotal)
      : null;
  const valoracion = vivienda.valoracionActual == null ? null : Number(vivienda.valoracionActual);
  const deuda = vivienda.deudaActual == null ? null : Number(vivienda.deudaActual);
  const equity =
    valoracion == null && deuda == null ? null : round((valoracion || 0) - (deuda || 0));
  return {
    inversionTotal,
    rentaAnual,
    segurosAnuales: seguros,
    gastosOperativos: operativos,
    costesAnuales,
    rentabilidadBruta,
    rentabilidad,
    rentabilidadNeta: rentabilidad,
    equity,
    rentaUsada: renta,
  };
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

module.exports = { cifrasVivienda, segurosAnuales, gastosOperativos, toNum, toDate };
