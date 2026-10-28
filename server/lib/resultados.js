function round(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function hueco() {
  return { ingresos: 0, gastos: 0, beneficio: 0 };
}

function doceMeses() {
  return Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, ...hueco() }));
}

function cubreMes(contrato, anio, monthIndex) {
  const inicio = new Date(contrato.fechaInicio).getTime();
  const fin = new Date(contrato.fechaFin).getTime();
  const from = Date.UTC(anio, monthIndex, 1);
  const to = Date.UTC(anio, monthIndex + 1, 0, 23, 59, 59, 999);
  return inicio <= to && fin >= from;
}

function cerrarMeses(porMes) {
  const anio = hueco();
  for (const m of porMes) {
    m.ingresos = round(m.ingresos);
    m.gastos = round(m.gastos);
    m.beneficio = round(m.ingresos - m.gastos);
    anio.ingresos += m.ingresos;
    anio.gastos += m.gastos;
  }
  anio.ingresos = round(anio.ingresos);
  anio.gastos = round(anio.gastos);
  anio.beneficio = round(anio.ingresos - anio.gastos);
  return anio;
}

function calcularResultados({ viviendas, gastos, contratos, anio, mes }) {
  const mapa = new Map();
  for (const v of viviendas) {
    mapa.set(String(v._id), {
      id: v._id,
      alias: v.alias,
      ciudad: v.ciudad || "",
      porMes: doceMeses(),
    });
  }

  for (const g of gastos) {
    const d = new Date(g.fecha);
    if (d.getUTCFullYear() !== anio) continue;
    const fila = mapa.get(String(g.vivienda));
    if (!fila) continue;
    fila.porMes[d.getUTCMonth()].gastos += Number(g.importe) || 0;
  }

  for (const c of contratos) {
    const renta = Number(c.renta) || 0;
    if (!renta) continue;
    const fila = mapa.get(String(c.vivienda));
    if (!fila) continue;
    for (let m = 0; m < 12; m += 1) {
      if (cubreMes(c, anio, m)) fila.porMes[m].ingresos += renta;
    }
  }

  const conjuntoPorMes = doceMeses();
  const lista = [];

  for (const fila of mapa.values()) {
    const anual = cerrarMeses(fila.porMes);
    const delMes = fila.porMes[mes - 1] || { mes, ...hueco() };
    lista.push({
      id: fila.id,
      alias: fila.alias,
      ciudad: fila.ciudad,
      mes: delMes,
      anio: anual,
      porMes: fila.porMes,
    });
    for (let i = 0; i < 12; i += 1) {
      conjuntoPorMes[i].ingresos += fila.porMes[i].ingresos;
      conjuntoPorMes[i].gastos += fila.porMes[i].gastos;
    }
  }

  lista.sort((a, b) => a.alias.localeCompare(b.alias, "es"));
  const anual = cerrarMeses(conjuntoPorMes);

  return {
    anio,
    mes,
    conjunto: {
      mes: conjuntoPorMes[mes - 1] || { mes, ...hueco() },
      anio: anual,
      porMes: conjuntoPorMes,
    },
    viviendas: lista,
  };
}

module.exports = { calcularResultados };
