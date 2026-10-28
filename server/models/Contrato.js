const mongoose = require("mongoose");

const contratoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda", required: true },
    inquilino: { type: String, required: true, trim: true },
    documento: { type: String, default: "" },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    renta: { type: Number, default: 0 },
    deposito: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contrato", contratoSchema);
