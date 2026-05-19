const Emisor = require('../models/Emisor');

// GET /api/emisores
exports.listar = async (req, res, next) => {
  try {
    const emisores = await Emisor.find().sort({ orden: 1, nombre: 1 });
    res.json(emisores);
  } catch (err) {
    next(err);
  }
};

// GET /api/emisores/:id
exports.obtener = async (req, res, next) => {
  try {
    const emisor = await Emisor.findById(req.params.id);
    if (!emisor) return res.status(404).json({ error: 'Emisor no encontrado' });
    res.json(emisor);
  } catch (err) {
    next(err);
  }
};

// POST /api/emisores
exports.crear = async (req, res, next) => {
  try {
    const emisor = await Emisor.create(req.body);
    res.status(201).json(emisor);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ya existe un emisor con ese slug' });
    }
    next(err);
  }
};

// PUT /api/emisores/:id
exports.actualizar = async (req, res, next) => {
  try {
    // Si se marca como predeterminado, desmarcar los demás
    if (req.body.predeterminado === true) {
      await Emisor.updateMany({ _id: { $ne: req.params.id } }, { predeterminado: false });
    }
    const emisor = await Emisor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!emisor) return res.status(404).json({ error: 'Emisor no encontrado' });
    res.json(emisor);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/emisores/:id
exports.eliminar = async (req, res, next) => {
  try {
    const emisor = await Emisor.findByIdAndDelete(req.params.id);
    if (!emisor) return res.status(404).json({ error: 'Emisor no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};