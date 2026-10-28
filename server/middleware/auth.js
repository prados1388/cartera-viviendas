const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ ok: false, error: "No autorizado" });
    }
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(datos.id);
    if (!usuario) {
      return res.status(401).json({ ok: false, error: "No autorizado" });
    }
    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ ok: false, error: "No autorizado" });
  }
}

module.exports = auth;
