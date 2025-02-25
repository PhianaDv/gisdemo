function hashStringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to RGB
  let r = (hash >> 16) & 255;
  let g = (hash >> 8) & 255;
  let b = hash & 255;

  // Normalize brightness to avoid extreme dark/light colors
  [r, g, b] = normalizeBrightness(r, g, b);

  // Convert to HSL to modify saturation & hue
  let [h, s, l] = rgbToHsl(r, g, b);

  // Increase saturation to avoid washed-out colors
  s = Math.min(100, s * 1.5); // Boost saturation by 50%

  // If hue falls in the brown range (30°-60°), shift it slightly
  if (h >= 30 && h <= 60) {
      h = (h + 50) % 360; // Shift away from browns
  }

  // Convert back to RGB
  [r, g, b] = hslToRgb(h, s, l);

  return rgbToHex(r, g, b);
}

// Normalize brightness to avoid too dark or too light colors
function normalizeBrightness(r, g, b) {
  const minBrightness = 80;
  const maxBrightness = 200;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  if (luminance < minBrightness) {
      const factor = minBrightness / luminance;
      r = Math.min(255, Math.round(r * factor));
      g = Math.min(255, Math.round(g * factor));
      b = Math.min(255, Math.round(b * factor));
  } else if (luminance > maxBrightness) {
      const factor = maxBrightness / luminance;
      r = Math.round(r * factor);
      g = Math.round(g * factor);
      b = Math.round(b * factor);
  }

  return [r, g, b];
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
      h = s = 0; // Gray colors
  } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
  }
  return [h, s * 100, l * 100];
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
  else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
  else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
  else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
  else if (h >= 300 && h < 360) [r, g, b] = [c, 0, x];

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

// Convert RGB to HEX
function rgbToHex(r, g, b) {
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}

// Exported functions
export function colorSuppliersHEX(values) {
  if (!values) return '#888888'; // Default neutral gray for unknown values
  return hashStringToColor(values);
}

export function colorSuppliersRGB(values) {
  const hex = colorSuppliersHEX(values);
  return hexToRGB(hex);
}

function hexToRGB(hex) {
  hex = hex.replace(/^#/, '');
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
