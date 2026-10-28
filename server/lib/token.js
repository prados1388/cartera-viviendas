const jwt = require("jsonwebtoken");

function firmar(usuario) {
  return jwt.sign(
    { id: usuario._id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publico(usuario) {
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    plan: usuario.plan,
    pruebaHasta: usuario.pruebaHasta,
  };
}

module.exports = { firmar, publico };
