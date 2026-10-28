const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 6 },
    plan: { type: String, enum: ["prueba", "activa"], default: "prueba" },
    pruebaHasta: { type: Date },
  },
  { timestamps: true }
);

usuarioSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

usuarioSchema.methods.comprobarPassword = function (plano) {
  return bcrypt.compare(plano, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
