const { cifrasVivienda, toNum, toDate } = require("./cifrasVivienda");

function seguroDe(body = {}) {
  return {
    compania: body.compania || "",
    poliza: body.poliza || "",
    vencimiento: toDate(body.vencimiento),
    importe: toNum(body.importe),
  };
}

function camposFicha(body) {
  return {
    alias: body.alias,
    descripcion: body.descripcion,
    direccion: body.direccion,
    ciudad: body.ciudad,
    referenciaCatastral: body.referenciaCatastral,
    metros: toNum(body.metros),
    tipo: body.tipo,
    anioConstruccion: toNum(body.anioConstruccion),
    anioReforma: toNum(body.anioReforma),
    fechaCompra: toDate(body.fechaCompra),
    precioCompra: toNum(body.precioCompra),
    otrosGastosCompraventa: toNum(body.otrosGastosCompraventa),
    rentaMensual: toNum(body.rentaMensual),
    valoracionActual: toNum(body.valoracionActual),
    deudaActual: toNum(body.deudaActual),
    eficienciaEnergetica: body.eficienciaEnergetica || "",
    datosFiscales: body.datosFiscales || "",
    seguroHogar: seguroDe(body.seguroHogar),
    seguroImpago: seguroDe(body.seguroImpago),
    contactos: Array.isArray(body.contactos)
      ? body.contactos
          .filter((c) => c && (c.nombre || c.telefono || c.email))
          .map((c) => ({
            nombre: c.nombre || "",
            rol: c.rol || "",
            telefono: c.telefono || "",
            email: c.email || "",
          }))
      : [],
    notas: body.notas,
  };
}

function conCifras(vivienda, rentaContrato) {
  const obj = vivienda.toObject ? vivienda.toObject() : vivienda;
  return { ...obj, cifras: cifrasVivienda(obj, rentaContrato) };
}

module.exports = { camposFicha, conCifras };
