function str(v) {
  return v == null ? "" : String(v);
}

function fechaInput(valor) {
  if (!valor) return "";
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function seguroAForm(s = {}) {
  return {
    compania: s.compania || "",
    poliza: s.poliza || "",
    vencimiento: fechaInput(s.vencimiento),
    importe: str(s.importe),
  };
}

export function viviendaAPerfil(v, c) {
  return {
    alias: v.alias || "",
    descripcion: v.descripcion || v.notas || "",
    direccion: v.direccion || "",
    ciudad: v.ciudad || "",
    tipo: v.tipo || "piso",
    referenciaCatastral: v.referenciaCatastral || "",
    metros: str(v.metros),
    anioConstruccion: str(v.anioConstruccion),
    anioReforma: str(v.anioReforma),
    fechaCompra: fechaInput(v.fechaCompra),
    precioCompra: str(v.precioCompra),
    otrosGastosCompraventa: str(v.otrosGastosCompraventa),
    rentaMensual: str(v.rentaMensual ?? c?.renta),
    valoracionActual: str(v.valoracionActual),
    deudaActual: str(v.deudaActual),
    eficienciaEnergetica: v.eficienciaEnergetica || "",
    datosFiscales: v.datosFiscales || "",
    seguroHogar: seguroAForm(v.seguroHogar),
    seguroImpago: seguroAForm(v.seguroImpago),
    contactos:
      v.contactos && v.contactos.length
        ? v.contactos.map((x) => ({
            nombre: x.nombre || "",
            rol: x.rol || "",
            telefono: x.telefono || "",
            email: x.email || "",
          }))
        : [{ nombre: "", rol: "", telefono: "", email: "" }],
    notas: v.notas || "",
    contratoId: c?._id || "",
    inquilino: c?.inquilino || "",
    documento: c?.documento || "",
    fechaInicio: fechaInput(c?.fechaInicio),
    fechaFin: fechaInput(c?.fechaFin),
    renta: c ? str(c.renta) : "",
    deposito: c ? str(c.deposito) : "",
    notasContrato: c?.notas || "",
  };
}

export function perfilAViviendaBody(perfil) {
  return {
    alias: perfil.alias,
    descripcion: perfil.descripcion,
    direccion: perfil.direccion,
    ciudad: perfil.ciudad,
    tipo: perfil.tipo,
    referenciaCatastral: perfil.referenciaCatastral,
    metros: perfil.metros,
    anioConstruccion: perfil.anioConstruccion,
    anioReforma: perfil.anioReforma,
    fechaCompra: perfil.fechaCompra,
    precioCompra: perfil.precioCompra,
    otrosGastosCompraventa: perfil.otrosGastosCompraventa,
    rentaMensual: perfil.rentaMensual || perfil.renta,
    valoracionActual: perfil.valoracionActual,
    deudaActual: perfil.deudaActual,
    eficienciaEnergetica: perfil.eficienciaEnergetica,
    datosFiscales: perfil.datosFiscales,
    seguroHogar: perfil.seguroHogar,
    seguroImpago: perfil.seguroImpago,
    contactos: perfil.contactos,
    notas: perfil.notas || perfil.descripcion,
  };
}

export function inversionEnVivo(perfil) {
  const precio = Number(perfil.precioCompra) || 0;
  const otros = Number(perfil.otrosGastosCompraventa) || 0;
  const inversion =
    perfil.precioCompra === "" && perfil.otrosGastosCompraventa === "" ? null : precio + otros;
  const renta = Number(perfil.rentaMensual || perfil.renta) || 0;
  const rentabilidad = inversion > 0 && renta > 0 ? (renta * 12 * 100) / inversion : null;
  const valoracion = perfil.valoracionActual === "" ? null : Number(perfil.valoracionActual);
  const deuda = perfil.deudaActual === "" ? null : Number(perfil.deudaActual);
  const equity =
    (valoracion == null || Number.isNaN(valoracion)) && (deuda == null || Number.isNaN(deuda))
      ? null
      : (valoracion || 0) - (deuda || 0);
  return { inversion, rentabilidad, equity };
}
