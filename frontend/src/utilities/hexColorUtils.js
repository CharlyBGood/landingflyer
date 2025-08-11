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
  const hex = expandHex(value);
  return /^#([0-9A-Fa-f]{6})$/.test(hex) ? hex : undefined;
};