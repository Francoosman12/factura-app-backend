const Emisor = require('../models/Emisor');

// Crea los emisores iniciales si no existen.
// Identifica por slug, así si lo corrés varias veces no duplica.
// Si el emisor ya existe, NO sobrescribe los datos (respeta cambios manuales).
const seedEmisores = async () => {
  const emisores = [
    {
      slug: 'luis-migliori',
      nombre: 'Luis Francisco Migliori Diaz',
      subtitulo: '',
      cuit: '20384877622',
      direccion: '',
      telefono: '',
      email: 'Luis.diaz.migliori@gmail.com',
      logo: '',
      orden: 1,
      predeterminado: true,
    },
    {
      slug: 'carlos-migliori',
      nombre: '3hmantenimiento',
      subtitulo: 'Soluciones confiables',
      cuit: '',
      direccion: 'B° los Lapachos Mza P - Lt 7',
      telefono: '3815052424',
      email: 'carlosesteban_migliori@hotmail.com',
      logo: '',
      orden: 2,
      predeterminado: false,
    },
  ];

  for (const data of emisores) {
    const existe = await Emisor.findOne({ slug: data.slug });
    if (!existe) {
      await Emisor.create(data);
      console.log(`   → Emisor creado: ${data.nombre}`);
    }
  }
};

module.exports = seedEmisores;