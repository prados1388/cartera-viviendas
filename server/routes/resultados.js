const express = require("express");
const Vivienda = require("../models/Vivienda");
const Gasto = require("../models/Gasto");
const Contrato = require("../models/Contrato");
const auth = require("../middleware/auth");
const { calcularResultados } = require("../lib/resultados");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res) => {
  const ahora = new Date();
  const anio = Number(req.query.anio) || ahora.getFullYear();
  const mes = Math.min(12, Math.max(1, Number(req.query.mes) || ahora.getMonth() + 1));
  const usuario = req.usuario._id;
  const filtroVivienda = req.query.vivienda;

  const filtro = { usuario };
  if (filtroVivienda) filtro._id = filtroVivienda;

  const viviendas = await Vivienda.find(filtro).select("alias ciudad");
  const ids = viviendas.map((v) => v._id);
  const desde = new Date(Date.UTC(anio - 1, 0, 1));
  const hasta = new Date(Date.UTC(anio + 1, 11, 31, 23, 59, 59, 999));

  const [gastos, contratos] = await Promise.all([
    Gasto.find({
      usuario,
      vivienda: { $in: ids },
      fecha: {
        $gte: new Date(Date.UTC(anio, 0, 1)),
        $lte: new Date(Date.UTC(anio, 11, 31, 23, 59, 59, 999)),
      },
    }),
    Contrato.find({
      usuario,
      vivienda: { $in: ids },
      fechaInicio: { $lte: hasta },
      fechaFin: { $gte: desde },
    }),
  ]);

  res.json({
    ok: true,
    data: calcularResultados({ viviendas, gastos, contratos, anio, mes }),
  });
});

module.exports = router;
