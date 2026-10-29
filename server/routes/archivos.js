const express = require("express");
const multer = require("multer");
const Vivienda = require("../models/Vivienda");
const Archivo = require("../models/Archivo");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

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

router.post("/:viviendaId/archivos", upload.single("archivo"), async (req, res) => {
  const vivienda = await viviendaDe(req, res);
  if (!vivienda) return;
  if (!req.file) return res.status(400).json({ ok: false, error: "Falta el archivo" });
  const tipo = req.body.tipo === "plano" ? "plano" : "escritura";
  const doc = await Archivo.create({
    usuario: req.usuario._id,
    vivienda: vivienda._id,
    tipo,
    nombre: req.file.originalname,
    mime: req.file.mimetype,
    size: req.file.size,
    datos: req.file.buffer,
  });
  res.status(201).json({
    ok: true,
    data: {
      _id: doc._id,
      tipo: doc.tipo,
      nombre: doc.nombre,
      mime: doc.mime,
      size: doc.size,
      createdAt: doc.createdAt,
    },
  });
});

router.get("/:viviendaId/archivos/:id", async (req, res) => {
  const archivo = await Archivo.findOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  }).select("+datos");
  if (!archivo) return res.status(404).json({ ok: false, error: "No encontrado" });
  res.setHeader("Content-Type", archivo.mime || "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(archivo.nombre)}"`
  );
  res.send(Buffer.isBuffer(archivo.datos) ? archivo.datos : Buffer.from(archivo.datos));
});

router.delete("/:viviendaId/archivos/:id", async (req, res) => {
  await Archivo.deleteOne({
    _id: req.params.id,
    vivienda: req.params.viviendaId,
    usuario: req.usuario._id,
  });
  res.json({ ok: true });
});

module.exports = router;
