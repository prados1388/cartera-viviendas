const mongoose = require("mongoose");

const seguroSchema = new mongoose.Schema(
  {
    compania: { type: String, default: "" },
    poliza: { type: String, default: "" },
    vencimiento: { type: Date },
    importe: { type: Number },
  },
  { _id: false }
);

const contactoSchema = new mongoose.Schema({
  nombre: { type: String, trim: true, default: "" },
  rol: { type: String, trim: true, default: "" },
  telefono: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, default: "" },
});

const viviendaSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    alias: { type: String, required: true, trim: true },
    descripcion: { type: String, default: "" },
    direccion: { type: String, required: true, trim: true },
    ciudad: { type: String, trim: true },
    referenciaCatastral: { type: String, trim: true, default: "" },
    metros: { type: Number },
    tipo: {
      type: String,
      enum: ["piso", "casa", "local", "otro"],
      default: "piso",
    },
    anioConstruccion: { type: Number },
    anioReforma: { type: Number },
    fechaCompra: { type: Date },
    precioCompra: { type: Number },
    otrosGastosCompraventa: { type: Number },
    rentaMensual: { type: Number },
    valoracionActual: { type: Number },
    deudaActual: { type: Number },
    eficienciaEnergetica: {
      type: String,
      enum: ["", "A", "B", "C", "D", "E", "F", "G"],
      default: "",
    },
    datosFiscales: { type: String, default: "" },
    seguroHogar: { type: seguroSchema, default: () => ({}) },
    seguroImpago: { type: seguroSchema, default: () => ({}) },
    contactos: { type: [contactoSchema], default: [] },
    notas: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vivienda", viviendaSchema);
