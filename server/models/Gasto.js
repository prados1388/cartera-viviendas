const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    vivienda: { type: mongoose.Schema.Types.ObjectId, ref: "Vivienda", required: true },
    concepto: { type: String, required: true, trim: true },
    categoria: {
      type: String,
      enum: ["comunidad", "ibi", "seguro", "reforma", "suministros", "plagas", "otro"],
      default: "otro",
    },
    importe: { type: Number, required: true },
    fecha: { type: Date, required: true },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gasto", gastoSchema);
