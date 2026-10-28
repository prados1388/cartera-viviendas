const mongoose = require("mongoose");

const viviendaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    alias: { type: String, required: true, trim: true },
    direccion: { type: String, required: true, trim: true },
    ciudad: { type: String, trim: true },
    tipo: {
      type: String,
      enum: ["piso", "casa", "local", "otro"],
      default: "piso",
    },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vivienda", viviendaSchema);
