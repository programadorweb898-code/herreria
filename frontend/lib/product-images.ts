const productImages: Record<string, string> = {
  "perchero": "/Gemini_Generated_Image_3geyj93geyj93gey.png",
  "estanteria-modular": "/Gemini_Generated_Image_9mrj8j9mrj8j9mrj.png",
  "mesa-auxiliar-cubica": "/Gemini_Generated_Image_iw9ykaiw9ykaiw9y.png",
  "estanteria-pared-lineal": "/Gemini_Generated_Image_mqrphdmqrphdmqrp.png",
  "estanteria-acero-geometrico": "/Gemini_Generated_Image_sxl7dqsxl7dqsxl7.png",
  "banco-industrial": "/Gemini_Generated_Image_wu8j42wu8j42wu8j.png",
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

  return "/Gemini_Generated_Image_wu8j42wu8j42wu8j.png";
}
