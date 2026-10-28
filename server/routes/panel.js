const express = require("express");
const Contrato = require("../models/Contrato");
const Alarma = require("../models/Alarma");
const Vivienda = require("../models/Vivienda");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  const usuario = req.usuario._id;
  const ahora = new Date();
  const en60 = new Date();
  en60.setDate(en60.getDate() + 60);

  const [viviendas, alarmas, contratos] = await Promise.all([
    Vivienda.countDocuments({ usuario }),
    Alarma.find({ usuario, hecha: false, fecha: { $lte: en60 } })
      .populate("vivienda", "alias")
      .sort({ fecha: 1 })
      .limit(12),
    Contrato.find({ usuario, activo: true, fechaFin: { $lte: en60, $gte: ahora } })
      .populate("vivienda", "alias")
      .sort({ fechaFin: 1 })
      .limit(12),
  ]);

  res.json({
    ok: true,
    data: { viviendas, alarmas, contratos, plan: req.usuario.plan },
  });
});

module.exports = router;
