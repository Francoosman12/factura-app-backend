const mongoose = require('mongoose');

const emisorSchema = new mongoose.Schema(
  {
    // Identificador estable para hardcodear en el seed (no se cambia)
    slug: { type: String, required: true, unique: true, trim: true },

    // Datos que aparecen en la factura
    nombre: { type: String, required: true, trim: true },
    subtitulo: { type: String, default: '', trim: true },
    cuit: { type: String, default: '', trim: true }, // CUIT o CUIL del emisor
    direccion: { type: String, default: '', trim: true },
    telefono: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    logo: { type: String, default: '' }, // base64

    // Para ordenar el listado y marcar el predeterminado
    orden: { type: Number, default: 0 },
    predeterminado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Emisor', emisorSchema);