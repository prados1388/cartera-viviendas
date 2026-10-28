const express = require("express");
const Vivienda = require("../models/Vivienda");
const Gasto = require("../models/Gasto");
const Contrato = require("../models/Contrato");
const Alarma = require("../models/Alarma");
const Plaga = require("../models/Plaga");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

async function viviendaDe(req, res) {
  const vivienda = await Vivienda.findOne({
    _id: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  if (!vivienda) {
    res.status(404).json({ ok: false, error: "Vivienda no encontrada" });
    return null;
  }
  return vivienda;
}

router.post("/:viviendaId/gastos", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const gasto = await Gasto.create({
    usuario: req.usuario._id,
    vivienda: vivienda._id,
    concepto: req.body.concepto,
    categoria: req.body.categoria,
    importe: req.body.importe,
    fecha: req.body.fecha,
    notas: req.body.notas,
  });
  res.status(201).json({ ok: true, data: gasto });
});

router.put("/:viviendaId/gastos/:id", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const gasto = await Gasto.findOneAndUpdate(
    { _id: req.params.id, vivienda: vivienda._id, usuario: req.usuario._id },
    {
      concepto: req.body.concepto,
      categoria: req.body.categoria,
      importe: req.body.importe,
      fecha: req.body.fecha,
      notas: req.body.notas,
    },
    { new: true, runValidators: true }
  );
  if (!gasto) return res.status(404).json({ ok: false, error: "No encontrado" });
  res.json({ ok: true, data: gasto });
});

router.delete("/:viviendaId/gastos/:id", async (req, res) => {
  await Gasto.deleteOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  res.json({ ok: true });
});

router.post("/:viviendaId/contratos", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const contrato = await Contrato.create({
    usuario: req.usuario._id,
    vivienda: vivienda._id,
    inquilino: req.body.inquilino,
    documento: req.body.documento,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    renta: req.body.renta,
    deposito: req.body.deposito,
    notas: req.body.notas,
  });
  res.status(201).json({ ok: true, data: contrato });
});

router.put("/:viviendaId/contratos/:id", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const contrato = await Contrato.findOneAndUpdate(
    { _id: req.params.id, vivienda: vivienda._id, usuario: req.usuario._id },
    {
      inquilino: req.body.inquilino,
      documento: req.body.documento,
      fechaInicio: req.body.fechaInicio,
      fechaFin: req.body.fechaFin,
      renta: req.body.renta,
      deposito: req.body.deposito,
      notas: req.body.notas,
    },
    { new: true, runValidators: true }
  );
  if (!contrato) return res.status(404).json({ ok: false, error: "No encontrado" });
  res.json({ ok: true, data: contrato });
});

router.delete("/:viviendaId/contratos/:id", async (req, res) => {
  await Contrato.deleteOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  res.json({ ok: true });
});

router.post("/:viviendaId/alarmas", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const alarma = await Alarma.create({
    usuario: req.usuario._id,
    vivienda: vivienda._id,
    tipo: req.body.tipo,
    titulo: req.body.titulo,
    fecha: req.body.fecha,
    notas: req.body.notas,
  });
  res.status(201).json({ ok: true, data: alarma });
});

router.put("/:viviendaId/alarmas/:id", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const alarma = await Alarma.findOneAndUpdate(
    { _id: req.params.id, vivienda: vivienda._id, usuario: req.usuario._id },
    {
      tipo: req.body.tipo,
      titulo: req.body.titulo,
      fecha: req.body.fecha,
      notas: req.body.notas,
    },
    { new: true, runValidators: true }
  );
  if (!alarma) return res.status(404).json({ ok: false, error: "No encontrada" });
  res.json({ ok: true, data: alarma });
});

router.patch("/:viviendaId/alarmas/:id", async (req, res) => {
  const alarma = await Alarma.findOneAndUpdate(
    { _id: req.params.id, vivienda: req.params.viviendaId, usuario: req.usuario._id },
    { hecha: req.body.hecha },
    { new: true }
  );
  res.json({ ok: true, data: alarma });
});

router.delete("/:viviendaId/alarmas/:id", async (req, res) => {
  await Alarma.deleteOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  res.json({ ok: true });
});

router.post("/:viviendaId/plagas", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const plaga = await Plaga.create({
    usuario: req.usuario._id,
    vivienda: vivienda._id,
    fecha: req.body.fecha,
    tratamiento: req.body.tratamiento,
    empresa: req.body.empresa,
    proximaRevision: req.body.proximaRevision,
    notas: req.body.notas,
  });
  res.status(201).json({ ok: true, data: plaga });
});

router.put("/:viviendaId/plagas/:id", async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  const plaga = await Plaga.findOneAndUpdate(
    { _id: req.params.id, vivienda: vivienda._id, usuario: req.usuario._id },
    {
      fecha: req.body.fecha,
      tratamiento: req.body.tratamiento,
      empresa: req.body.empresa,
      proximaRevision: req.body.proximaRevision || null,
      notas: req.body.notas,
    },
    { new: true, runValidators: true }
  );
  if (!plaga) return res.status(404).json({ ok: false, error: "No encontrado" });
  res.json({ ok: true, data: plaga });
});

router.delete("/:viviendaId/plagas/:id", async (req, res) => {
  await Plaga.deleteOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  res.json({ ok: true });
});

module.exports = router;
