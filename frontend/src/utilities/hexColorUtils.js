function expandHex(hex) {
  if (/^#([\da-fA-F])([\da-fA-F])([\da-fA-F])$/.test(hex)) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  if (/^#([\da-fA-F])([\da-fA-F])([\da-fA-F])([\da-fA-F])$/.test(hex)) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
  }
  return hex;
};

export function getInputColor(value) {
  if (!value) return undefined;
  
  // Limpiar el valor (quitar espacios)
  const cleanValue = value.trim();
  
  // Si ya es un hex válido
  const hex = expandHex(cleanValue);
  if (/^#([0-9A-Fa-f]{6})$/.test(hex)) {
    return hex;
  }
  
  // Convertir RGB a hex
  if (cleanValue.startsWith('rgb(')) {
    const rgbMatch = cleanValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    }
  }
  
  // Convertir RGBA a hex (ignorando alpha)
  if (cleanValue.startsWith('rgba(')) {
    const rgbaMatch = cleanValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
    }
  }
  
  return undefined;
};