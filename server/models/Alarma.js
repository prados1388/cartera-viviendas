const mongoose = require("mongoose");

const alarmaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda", required: true },
    tipo: {
      type: String,
      enum: ["revision", "plagas", "contrato", "otro"],
      default: "revision",
    },
    titulo: { type: String, required: true, trim: true },
    fecha: { type: Date, required: true },
    hecha: { type: Boolean, default: false },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alarma", alarmaSchema);
