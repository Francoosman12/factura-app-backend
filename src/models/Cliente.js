const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cuit: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, default: '' },
    telefono: { type: String, trim: true, default: '' },
    direccion: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

clienteSchema.index({ nombre: 'text', cuit: 'text' });

module.exports = mongoose.model('Cliente', clienteSchema);
