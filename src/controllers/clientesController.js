const Cliente = require('../models/Cliente');

// GET /api/clientes?search=...
exports.listar = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filtro = search
      ? {
          $or: [
            { nombre: { $regex: search, $options: 'i' } },
            { cuit: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const clientes = await Cliente.find(filtro).sort({ nombre: 1 });
    res.json(clientes);
  } catch (err) {
    next(err);
  }
};

// GET /api/clientes/:id
exports.obtener = async (req, res, next) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
};

// POST /api/clientes
exports.crear = async (req, res, next) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    next(err);
  }
};

// PUT /api/clientes/:id
exports.actualizar = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/clientes/:id
exports.eliminar = async (req, res, next) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
