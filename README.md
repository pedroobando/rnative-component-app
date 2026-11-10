# Component App

Aplicación móvil multiplataforma (iOS, Android y web) construida con **Expo SDK 58** y **React Native 0.88** que sirve como catálogo y banco de pruebas de componentes, navegabilidad y animaciones.

No es una app de producto: es una **app de laboratorio** donde cada pantalla aísla una capacidad concreta del framework (listados, scroll infinito, modales, refresh, temas, animaciones, controles nativos) para poder estudiarla y reutilizarla.

## Qué hace

- **Navegación con menú lateral (Drawer)** definido por enrutado basado en archivos (Expo Router), con secciones *General*, *Componentes*, *UI* y *Animaciones*.
- **Temas claro/oscuro y temáticos** (light, dark, ocean, emerald, orange, frost) con tokens CSS compartidos entre Tailwind v4 y Uniwind; el tema del sistema se respeta automáticamente.
- **Paleta y componentes base reutilizables** (`ThemedView`, `ThemedText`) que se adaptan al tema activo sin código condicional.
- **Pantallas de demostración** para los patrones más usados en apps móviles.

## Pantallas

| Ruta | Qué demuestra |
| --- | --- |
| `/` | Portada: paleta de tokens, enlaces con `Link` y `router.push`. |
| `/about` | Navegación declarativa vs. imperativa con Expo Router. |
| `/themes` | Cambio de tema en caliente con `Uniwind.setTheme()`. |
| `/pull-to-refresh` | Patrón de recarga tirando hacia abajo. |
| `/section-list` | Listas agrupadas con `SectionList`. |
| `/modal` | Presentación de pantallas modales. |
| `/infinite-scroll` | Paginación y scroll infinito. |
| `/slides` | Contenedor de slides / carrusel. |
| `/switches` | Controles de tipo switch/checkbox. |
| `/alerts` | Alertas y diálogos nativos. |
| `/text-inputs` | Campos de texto y validación de entrada. |
| `/animation-101` | Fundamentos de animación con Reanimated. |
| `/animation-102` | Patrones avanzados de animación. |

## Stack

- **Expo SDK 58** · React Native 0.88 · React 19
- **Expo Router** con rutas tipadas (`typedRoutes`) y React Compiler habilitado
- **Uniwind** + **Tailwind CSS v4** (CSS-first, sin `tailwind.config.js`)
- **Reanimated 4** + **Gesture Handler** para animaciones y gestos
- **@expo/ui**, `@expo/vector-icons`, `expo-symbols`, `expo-image`, `expo-glass-effect`
- **TypeScript** estricto

## Estructura

```
src/
├── app/            # Pantallas. Cada archivo es una ruta (Expo Router)
│   ├── _layout.tsx # Layout raíz: Drawer + tema de navegación
│   └── ...         # Una carpeta/archivo por pantalla
├── components/     # Componentes reutilizables (ThemedText, ThemedView, drawer)
├── constants/      # Rutas del menú y catálogo de temas
├── hooks/          # Hooks de tema y color de navegación
└── utils/          # Utilidades (contraste de color)
```

Las rutas del menú lateral se declaran una sola vez en `src/constants/Routes.ts`; el layout raíz las registra automáticamente, por lo que añadir una pantalla es un paso de dos: crear el archivo en `src/app/` y añadir su entrada en `Routes.ts`.

## Puesta en marcha

Requiere Node.js y [pnpm](https://pnpm.io) (el proyecto usa `pnpm-lock.yaml`).

```bash
pnpm install
pnpm start          # servidor de desarrollo de Expo
```

Comandos disponibles:

```bash
pnpm start          # Expo dev server
pnpm ios            # abre en el simulador de iOS
pnpm android        # abre en el emulador de Android
pnpm web            # abre en el navegador
pnpm lint           # ESLint (configuración de Expo)
npx tsc --noEmit    # comprobación de tipos
```

> **Nota:** las dependencias con código nativo (`@expo/ui`, `expo-glass-effect`, Reanimated) no vienen en Expo Go. Para probarlas en un dispositivo o emulador necesitas una *development build*: `npx expo run:ios`, `npx expo run:android` o `eas build --profile development`.

## Temas

Los colores viven en un único sitio: `src/global.css`. Cada tema define el mismo conjunto de variables (`--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-success`, `--color-text`, `--color-background`, `--color-border`), y se exponen como utilidades de Tailwind/Uniwind (`bg-primary`, `text-text`, `border-border`, …).

Los temas adicionales (ocean, emerald, orange, frost) se registran en `metro.config.js` (`extraThemes`). Para leer un token desde JavaScript usa `useThemeColor` o `useResolvedColor` de `@/hooks/`.

## Inteligencia artificial

En el desarrollo de este proyecto se utilizó el **TUI de Pi** como asistente de programación, junto con el modelo de lenguaje **minimax-m3.1-flash**.

## Licencia

MIT — ver [LICENSE](./LICENSE).
