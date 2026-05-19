const Factura = require('../models/Factura');

// Helper: calcula neto, impuestos totales y total a partir del payload
const calcularTotales = (items = [], impuestos = []) => {
  const neto = items.reduce(
    (acc, it) => acc + (Number(it.cantidad) || 0) * (Number(it.precio) || 0),
    0
  );
  const totalImpuestos = impuestos
    .filter((i) => i.activo)
    .reduce((acc, i) => {
      if (i.tipo === 'porcentaje') return acc + (neto * (Number(i.valor) || 0)) / 100;
      return acc + (Number(i.valor) || 0);
    }, 0);
  return { neto, totalImpuestos, total: neto + totalImpuestos };
};

// GET /api/facturas?search=...&page=1&limit=20
exports.listar = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filtro = search
      ? {
          $or: [
            { numero: { $regex: search, $options: 'i' } },
            { 'cliente.nombre': { $regex: search, $options: 'i' } },
            { 'cliente.cuit': { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const skip = (Number(page) - 1) * Number(limit);
    const [facturas, total] = await Promise.all([
      Factura.find(filtro)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-emisor.logo'), // no devolver logo (pesado) en listados
      Factura.countDocuments(filtro),
    ]);

    res.json({ facturas, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
};

// GET /api/facturas/:id
exports.obtener = async (req, res, next) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    next(err);
  }
};

// POST /api/facturas
exports.crear = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { neto, totalImpuestos, total } = calcularTotales(data.items, data.impuestos);
    data.neto = neto;
    data.totalImpuestos = totalImpuestos;
    data.total = total;

    const factura = await Factura.create(data);
    res.status(201).json(factura);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una factura con ese número' });
    }
    next(err);
  }
};

// PUT /api/facturas/:id
exports.actualizar = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const { neto, totalImpuestos, total } = calcularTotales(data.items, data.impuestos);
    data.neto = neto;
    data.totalImpuestos = totalImpuestos;
    data.total = total;

    const factura = await Factura.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una factura con ese número' });
    }
    next(err);
  }
};

// DELETE /api/facturas/:id
exports.eliminar = async (req, res, next) => {
  try {
    const factura = await Factura.findByIdAndDelete(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

// GET /api/facturas/siguiente-numero
// Devuelve el próximo número sugerido (basado en el último COT-XXXX)
exports.siguienteNumero = async (req, res, next) => {
  try {
    const prefijo = (req.query.prefijo || 'COT-').toString();
    const ultima = await Factura.findOne({ numero: new RegExp(`^${prefijo}\\d+$`) })
      .sort({ createdAt: -1 })
      .select('numero');
    let next = 1;
    if (ultima) {
      const m = ultima.numero.match(/(\d+)$/);
      if (m) next = parseInt(m[1], 10) + 1;
    }
    const numero = `${prefijo}${String(next).padStart(4, '0')}`;
    res.json({ numero });
  } catch (err) {
    next(err);
  }
};
