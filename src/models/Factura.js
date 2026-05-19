const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    descripcion: { type: String, default: '' },
    cantidad: { type: Number, default: 1 },
    precio: { type: Number, default: 0 },
  },
  { _id: false }
);

const impuestoSchema = new mongoose.Schema(
  {
    id: String,
    label: String,
    tipo: { type: String, enum: ['porcentaje', 'monto'], default: 'porcentaje' },
    valor: { type: Number, default: 0 },
    activo: { type: Boolean, default: false },
    fijo: { type: Boolean, default: false },
  },
  { _id: false }
);

const facturaSchema = new mongoose.Schema(
  {
    numero: { type: String, required: true, trim: true, unique: true },
    titulo: { type: String, default: 'FACTURA' },
    fecha: { type: String, default: '' },
    validez: { type: String, default: '10' },
    cae: { type: String, default: '' },
    vtoCae: { type: String, default: '' },

    emisor: {
      emisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Emisor', default: null },
      nombre: { type: String, default: '' },
      subtitulo: { type: String, default: '' },
      cuit: { type: String, default: '' },
      direccion: { type: String, default: '' },
      telefono: { type: String, default: '' },
      email: { type: String, default: '' },
      logo: { type: String, default: '' }, // dataURL base64
    },

    cliente: {
      nombre: { type: String, default: '' },
      cuit: { type: String, default: '' },
      clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', default: null },
    },

    items: [itemSchema],
    impuestos: [impuestoSchema],
    observaciones: { type: String, default: '' },

    // Snapshots calculados al guardar (útil para listados sin recalcular)
    neto: { type: Number, default: 0 },
    totalImpuestos: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

facturaSchema.index({ numero: 'text', 'cliente.nombre': 'text', 'cliente.cuit': 'text' });

module.exports = mongoose.model('Factura', facturaSchema);