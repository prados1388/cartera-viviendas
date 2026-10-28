const mongoose = require("mongoose");

const plagaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda", required: true },
    fecha: { type: Date, required: true },
    tratamiento: { type: String, required: true, trim: true },
    empresa: { type: String, default: "" },
    proximaRevision: { type: Date },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plaga", plagaSchema);
