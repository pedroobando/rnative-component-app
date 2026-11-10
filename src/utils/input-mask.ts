/**
 * Utilidades de máscara/sanitizado para los inputs de texto.
 *
 * Se usan desde `ThemedInputText` para:
 *  - filtrar lo que el usuario escribe según la variante (numérico, decimal...)
 *  - aplicar una plantilla/máscara tipo `XXX-XXXX-X`
 *
 * Sintaxis de la plantilla:
 *  - `X` -> un carácter alfanumérico (letra o dígito)
 *  - `9` o `#` -> un carácter numérico
 *  - `A` -> una letra
 *  - cualquier otro carácter -> separador literal ( `-`, `/`, ` `, `(` ...)
 */

/** Tipo de hueco (slot) de una plantilla. */
export type MaskSlotType = 'alnum' | 'digit' | 'letter';

/** Elemento de una plantilla parseada: un hueco o un separador literal. */
export type MaskItem =
  | { kind: 'slot'; type: MaskSlotType; char: string }
  | { kind: 'literal'; char: string };

/** Tipos de carácter que acepta cada tipo de hueco. */
const SLOT_PATTERNS: Record<MaskSlotType, RegExp> = {
  alnum: /[A-Za-z0-9]/,
  digit: /[0-9]/,
  letter: /[A-Za-z]/,
};

/** `true` si el carácter es válido para el tipo de hueco. */
export function matchesSlot(char: string, type: MaskSlotType): boolean {
  return SLOT_PATTERNS[type].test(char);
}

/**
 * Parsea una plantilla en sus elementos (huecos + separadores).
 *
 * ```ts
 * parseTemplate('XXX-XXXX-X');
 * // -> [slot, slot, slot, '-', slot, slot, slot, slot, '-', slot]
 * ```
 */
export function parseTemplate(template: string): MaskItem[] {
  const items: MaskItem[] = [];

  for (const char of template) {
    if (char === 'X') {
      items.push({ kind: 'slot', type: 'alnum', char });
    } else if (char === '9' || char === '#') {
      items.push({ kind: 'slot', type: 'digit', char });
    } else if (char === 'A') {
      items.push({ kind: 'slot', type: 'letter', char });
    } else {
      items.push({ kind: 'literal', char });
    }
  }

  return items;
}

/** Los separadores literales de una plantilla. */
function literalsOf(items: MaskItem[]): Set<string> {
  const literals = new Set<string>();

  for (const item of items) {
    if (item.kind === 'literal') {
      literals.add(item.char);
    }
  }

  return literals;
}

/**
 * Extrae el "valor real" (sin separadores) a partir de un texto ya formateado.
 *
 * Los caracteres que no encajan en su hueco se descartan, de forma que un
 * texto con formato inválido nunca rompe la máscara.
 */
export function extractRaw(text: string, items: MaskItem[]): string {
  const literals = literalsOf(items);
  const slots = items.filter((item) => item.kind === 'slot');

  let raw = '';
  let slotIndex = 0;

  for (const char of text) {
    if (slotIndex >= slots.length) {
      break;
    }

    // Los separadores no forman parte del valor.
    if (literals.has(char)) {
      continue;
    }

    const slot = slots[slotIndex];

    if (slot.kind === 'slot' && matchesSlot(char, slot.type)) {
      raw += char;
      slotIndex += 1;
    }
  }

  return raw;
}

/**
 * Aplica la plantilla sobre el valor real y devuelve el texto formateado.
 *
 * Los separadores solo se muestran cuando hay contenido detrás, así que no
 * aparece un "-", al final mientras el campo está vacío o a medio rellenar.
 */
export function formatRaw(raw: string, items: MaskItem[]): string {
  let output = '';
  let consumed = 0;

  for (const item of items) {
    if (item.kind === 'literal') {
      // Solo pintamos el separador si queda contenido por delante.
      if (consumed < raw.length) {
        output += item.char;
      }

      continue;
    }

    while (consumed < raw.length) {
      const char = raw[consumed];

      if (matchesSlot(char, item.type)) {
        output += char;
        consumed += 1;

        break;
      }

      // Carácter no válido para este hueco: lo descartamos.
      consumed += 1;
    }
  }

  return output;
}

/**
 * Normaliza un texto cualquiera al formato de la plantilla.
 *
 * Es idempotente: aplicarla dos veces sobre un texto ya formateado devuelve
 * el mismo resultado.
 */
export function maskText(text: string, template: string): string {
  const items = parseTemplate(template);

  if (!items.some((item) => item.kind === 'slot')) {
    return text;
  }

  return formatRaw(extractRaw(text, items), items);
}

/**
 * Calcula el texto formateado tras una edición del usuario.
 *
 * - Detecta el borrado de un separador (por ejemplo, borrar el "-" del medio):
 *   en ese caso también se borra el último carácter útil.
 * - Mantiene el formato en cualquier otro caso.
 */
export function applyTemplateChange(
  nextText: string,
  previousText: string,
  template: string
): string {
  const items = parseTemplate(template);

  if (!items.some((item) => item.kind === 'slot')) {
    return nextText;
  }

  const nextRaw = extractRaw(nextText, items);
  const previousRaw = extractRaw(previousText, items);

  // Se ha borrado un separador: el valor real no cambió, pero el usuario
  // espera que el carácter anterior también desaparezca.
  if (nextRaw.length === previousRaw.length && nextText.length < previousText.length) {
    return formatRaw(previousRaw.slice(0, -1), items);
  }

  return formatRaw(nextRaw, items);
}

/* -------------------------------------------------------------------------- */
/*                         Variantes (filtro por tipo de dato)                 */
/* -------------------------------------------------------------------------- */

/** Variantes de entrada soportadas por `ThemedInputText`. */
export type InputVariant =
  | 'text'
  | 'numeric'
  | 'decimal'
  | 'alphanumeric'
  | 'email'
  | 'phone'
  | 'password'
  | 'template';

/**
 * Filtra el texto según la variante de la entrada.
 *
 * - `numeric`: solo dígitos.
 * - `decimal`: dígitos con un único separador decimal (`,` o `.`).
 * - `alphanumeric`: solo letras y dígitos.
 * - `phone`: dígitos y los signos habituales de un teléfono.
 * - `email`: sin espacios.
 * - `text` / `password`: no se toca el contenido.
 */
export function sanitizeByVariant(text: string, variant: InputVariant): string {
  switch (variant) {
    case 'numeric':
      return text.replace(/[^0-9]/g, '');

    case 'alphanumeric':
      return text.replace(/[^A-Za-z0-9]/g, '');

    case 'decimal': {
      const normalized = text.replace(/,/g, '.').replace(/[^0-9.]/g, '');
      const [integer = '', decimals] = normalized.split('.');

      // Solo un separador decimal y, como mucho, X decimales.
      return decimals === undefined ? integer : `${integer}.${decimals.replace(/\./g, '')}`;
    }

    case 'phone':
      return text.replace(/[^0-9+()\- ]/g, '');

    case 'email':
      return text.replace(/\s/g, '');

    default:
      return text;
  }
}

/** Regex sencilla (pero suficiente) para validar emails. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** `true` si el texto parece un email válido. */
export function isValidEmail(text: string): boolean {
  return EMAIL_PATTERN.test(text.trim());
}
