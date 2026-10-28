const express = require("express");
const Usuario = require("../models/Usuario");
const { firmar, publico } = require("../lib/token");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/registro", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, error: "Faltan datos" });
    }
    const existe = await Usuario.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ ok: false, error: "Ese email ya está registrado" });
    }
    const pruebaHasta = new Date();
    pruebaHasta.setDate(pruebaHasta.getDate() + 30);
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      plan: "prueba",
      pruebaHasta,
    });
    const token = firmar(usuario);
    res.status(201).json({ ok: true, token, usuario: publico(usuario) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email: String(email || "").toLowerCase() }).select(
      "+password"
    );
    if (!usuario || !(await usuario.comprobarPassword(password))) {
      return res.status(400).json({ ok: false, error: "Email o contraseña no válidos" });
    }
    const token = firmar(usuario);
    res.json({ ok: true, token, usuario: publico(usuario) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({ ok: true, usuario: publico(req.usuario) });
});

module.exports = router;
