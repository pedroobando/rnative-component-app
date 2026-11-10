/**
 * Utilidades de contraste de color.
 *
 * Permiten garantizar que el texto de la app sea legible sobre el fondo
 * activo del tema, calculando la luminancia relativa (WCAG 2.1) y la razón
 * de contraste entre dos colores.
 *
 * Soporta los formatos que usa Uniwind en sus variables CSS:
 *   - #rgb, #rgba, #rrggbb, #rrggbbaa
 *   - rgb(r, g, b), rgba(r, g, b, a)
 */

export type Rgb = { r: number; g: number; b: number };

const HEX_PATTERN = /^#?([0-9a-f]{3,8})$/i;
const RGB_PATTERN = /^rgba?\(([^)]+)\)$/i;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Convierte un color a RGB. Devuelve `null` si el formato no es soportado. */
export function parseColor(color?: string | null): Rgb | null {
  if (!color) {
    return null;
  }

  const value = color.trim();

  const hex = value.match(HEX_PATTERN);
  if (hex) {
    const digits = hex[1];

    if (digits.length === 3 || digits.length === 4) {
      const [r, g, b] = digits
        .slice(0, 3)
        .split('')
        .map((char) => parseInt(char + char, 16));

      return { r, g, b };
    }

    if (digits.length === 6 || digits.length === 8) {
      return {
        r: parseInt(digits.slice(0, 2), 16),
        g: parseInt(digits.slice(2, 4), 16),
        b: parseInt(digits.slice(4, 6), 16),
      };
    }

    return null;
  }

  const rgb = value.match(RGB_PATTERN);
  if (rgb) {
    const parts = rgb[1].split(',').map((part) => part.trim());

    if (parts.length < 3) {
      return null;
    }

    return {
      r: clamp(parseInt(parts[0], 10) || 0, 0, 255),
      g: clamp(parseInt(parts[1], 10) || 0, 0, 255),
      b: clamp(parseInt(parts[2], 10) || 0, 0, 255),
    };
  }

  return null;
}

/** Luminancia relativa de un color (0 = negro, 1 = blanco). */
export function getLuminance(color?: string | null): number {
  const rgb = parseColor(color);

  if (!rgb) {
    return 0;
  }

  const channel = (value: number) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** Razón de contraste entre dos colores (1 = idénticos, 21 = blanco/negro). */
export function getContrastRatio(colorA?: string | null, colorB?: string | null): number {
  const a = getLuminance(colorA);
  const b = getLuminance(colorB);

  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Devuelve el mismo color con la opacidad indicada (0-1).
 *
 * Útil para placeholders, textos secundarios o bordes que necesitan ser
 * más tenues que el color base del tema.
 */
export function withOpacity(color?: string | null, opacity = 1): string | undefined {
  const rgb = parseColor(color);

  if (!rgb) {
    return color ?? undefined;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/** `true` si el color es oscuro (luminosidad < 0.5). */
export function isDarkColor(color?: string | null): boolean {
  return getLuminance(color) < 0.5;
}

/**
 * Elige, entre los candidatos, el color con mayor contraste frente al fondo.
 *
 * - Si algún candidato alcanza `minRatio` (4.5 = AA para texto normal), se
 *   devuelve el primero que lo cumple (se conservan así la intención del tema).
 * - Si ninguno cumple, se devuelve el de mayor contraste.
 * - Si no se puede analizar el fondo, se devuelve el primer candidato válido.
 */
export function getContrastingColor(
  background: string | undefined | null,
  candidates: (string | undefined)[],
  minRatio = 4.5
): string | undefined {
  const valid = candidates.filter((color): color is string => Boolean(color));

  if (valid.length === 0) {
    return undefined;
  }

  if (!parseColor(background)) {
    return valid[0];
  }

  let best = valid[0];
  let bestRatio = getContrastRatio(background, best);

  for (const candidate of valid) {
    const ratio = getContrastRatio(background, candidate);

    if (ratio >= minRatio) {
      return candidate;
    }

    if (ratio > bestRatio) {
      best = candidate;
      bestRatio = ratio;
    }
  }

  return best;
}
