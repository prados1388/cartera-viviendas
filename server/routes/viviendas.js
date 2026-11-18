const express = require("express");
const Vivienda = require("../models/Vivienda");
const Gasto = require("../models/Gasto");
const Contrato = require("../models/Contrato");
const Alarma = require("../models/Alarma");
const Plaga = require("../models/Plaga");
const Archivo = require("../models/Archivo");
const auth = require("../middleware/auth");
const { camposFicha, conCifras } = require("../lib/ficha");

const router = express.Router();
router.use(auth);

function gastosDelAnio(usuario, ids, anio) {
  return Gasto.find({
    usuario,
    vivienda: { $in: ids },
    fecha: {
      $gte: new Date(Date.UTC(anio, 0, 1)),
      $lte: new Date(Date.UTC(anio, 11, 31, 23, 59, 59, 999)),
    },
  });
}

function agruparGastos(gastos) {
  const mapa = new Map();
  for (const g of gastos) {
    const k = String(g.vivienda);
    if (!mapa.has(k)) mapa.set(k, []);
    mapa.get(k).push(g);
  }
  return mapa;
}

router.get("/", async (req, res) => {
  const viviendas = await Vivienda.find({ usuario: req.usuario._id }).sort({ alias: 1 });
  const anio = new Date().getFullYear();
  const gastos = await gastosDelAnio(
    req.usuario._id,
    viviendas.map((v) => v._id),
    anio
  );
  const porVivienda = agruparGastos(gastos);
  res.json({
    ok: true,
    data: viviendas.map((v) => conCifras(v, { gastos: porVivienda.get(String(v._id)) || [], anio })),
  });
});

router.post("/", async (req, res) => {
  const { alias, direccion, ciudad, tipo, notas } = req.body;
  if (!alias || !direccion) {
    return res.status(400).json({ ok: false, error: "Alias y dirección son obligatorios" });
  }
  const vivienda = await Vivienda.create({
    usuario: req.usuario._id,
    alias,
    direccion,
    ciudad,
    tipo,
    notas,
  });
  res.status(201).json({ ok: true, data: conCifras(vivienda) });
});

router.get("/:id", async (req, res) => {
  const vivienda = await Vivienda.findOne({ _id: req.params.id, usuario: req.usuario._id });
  if (!vivienda) return res.status(404).json({ ok: false, error: "No encontrada" });
  const [gastos, contratos, alarmas, plagas, archivos] = await Promise.all([
    Gasto.find({ vivienda: vivienda._id }).sort({ fecha: -1 }),
    Contrato.find({ vivienda: vivienda._id }).sort({ fechaFin: -1 }),
    Alarma.find({ vivienda: vivienda._id }).sort({ fecha: 1 }),
    Plaga.find({ vivienda: vivienda._id }).sort({ fecha: -1 }),
    Archivo.find({ vivienda: vivienda._id }).select("-datos").sort({ createdAt: -1 }),
  ]);
  const contratoActivo = contratos.find((c) => c.activo) || contratos[0];
  res.json({
    ok: true,
    data: {
      vivienda: conCifras(vivienda, { rentaContrato: contratoActivo?.renta, gastos }),
      gastos,
      contratos,
      alarmas,
      plagas,
      archivos,
    },
  });
});

router.put("/:id", async (req, res) => {
  if (!req.body.alias || !req.body.direccion) {
    return res.status(400).json({ ok: false, error: "Alias y dirección son obligatorios" });
  }
  const vivienda = await Vivienda.findOneAndUpdate(
    { _id: req.params.id, usuario: req.usuario._id },
    camposFicha(req.body),
    { new: true, runValidators: true }
  );
  if (!vivienda) return res.status(404).json({ ok: false, error: "No encontrada" });
  const anio = new Date().getFullYear();
  const gastos = await gastosDelAnio(req.usuario._id, [vivienda._id], anio);
  res.json({
    ok: true,
    data: conCifras(vivienda, { rentaContrato: req.body.rentaMensual, gastos, anio }),
  });
});

router.delete("/:id", async (req, res) => {
  const vivienda = await Vivienda.findOneAndDelete({
    _id: req.params.id,
    usuario: req.usuario._id,
  });
  if (!vivienda) return res.status(404).json({ ok: false, error: "No encontrada" });
  await Promise.all([
    Gasto.deleteMany({ vivienda: vivienda._id }),
    Contrato.deleteMany({ vivienda: vivienda._id }),
    Alarma.deleteMany({ vivienda: vivienda._id }),
    Plaga.deleteMany({ vivienda: vivienda._id }),
    Archivo.deleteMany({ vivienda: vivienda._id }),
  ]);
  res.json({ ok: true });
});

module.exports = router;
