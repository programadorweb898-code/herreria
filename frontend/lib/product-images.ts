const productImages: Record<string, string> = {
  "perchero": "/Estanteria-Tupungato-300x300.webp",
  "estanteria-modular": "/estanteria=montecarlo.webp",
  "mesa-auxiliar-cubica": "/dresuar-filadelfia.webp",
  "estanteria-pared-lineal": "/bodega-milan.webp",
  "estanteria-acero-geometrico": "/models/banqueta.webp",
  "banco-industrial": "/mesa-ratona.webp",
};

const slugByName: Record<string, string> = {
  "Perchero": "perchero",
  "Estantería modular": "estanteria-modular",
  "Mesa auxiliar cúbica": "mesa-auxiliar-cubica",
  "Estantería de pared lineal": "estanteria-pared-lineal",
  "Estantería de acero geométrico": "estanteria-acero-geometrico",
  "Banco industrial": "banco-industrial",
};

export function getProductImage(slug?: string, name?: string, image?: string) {
  if (slug && productImages[slug]) {
    return productImages[slug];
  }

  if (name && slugByName[name] && productImages[slugByName[name]]) {
    return productImages[slugByName[name]];
  }

  if (image) {
    return image;
  }

  return "/mesa-ratona.webp";
}
