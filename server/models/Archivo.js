const mongoose = require("mongoose");

const archivoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda", required: true },
    tipo: { type: String, enum: ["escritura", "plano"], required: true },
    nombre: { type: String, required: true, trim: true },
    mime: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0 },
    datos: { type: Buffer, required: true, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Archivo", archivoSchema);
