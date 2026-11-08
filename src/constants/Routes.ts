/**
 * Rutas de la app.
 *
 * Cada entrada describe una pantalla de `src/app/`:
 *  - `title`: texto que se ve en el header y en el menú lateral.
 *  - `icon`:  nombre del icono en Ionicons (https://icons.expo.fyi).
 *  - `name`:  nombre de la ruta dentro de `src/app` (sin la barra inicial).
 *
 * Ej: `pull-to-refresh/index` -> `src/app/pull-to-refresh/index.tsx` -> `/pull-to-refresh`
 */

export type MenuRoute = {
  title: string;
  icon: string;
  name: string;
};

/** Sección del menú lateral: un título y sus rutas. */
export type MenuSection = {
  title: string;
  routes: MenuRoute[];
};

export const menuRoutes: MenuRoute[] = [
  {
    title: 'Pull to refresh',
    icon: 'refresh-outline',
    name: 'pull-to-refresh/index',
  },
  {
    title: 'Section List',
    icon: 'list-outline',
    name: 'section-list/index',
  },
  {
    title: 'Modal',
    icon: 'copy-outline',
    name: 'modal/index',
  },
  {
    title: 'InfiniteScroll',
    icon: 'download-outline',
    name: 'infinite-scroll/index',
  },
  {
    title: 'Slides',
    icon: 'flower-outline',
    name: 'slides/index',
  },
  {
    title: 'Themes',
    icon: 'flask-outline',
    name: 'themes/index',
  },
];

export const uiMenuRoutes: MenuRoute[] = [
  {
    title: 'Switches',
    icon: 'toggle-outline',
    name: 'switches/index',
  },
  {
    title: 'Alerts',
    icon: 'alert-circle-outline',
    name: 'alerts/index',
  },
  {
    title: 'TextInputs',
    icon: 'document-text-outline',
    name: 'text-inputs/index',
  },
];

export const animationMenuRoutes: MenuRoute[] = [
  {
    title: 'Animation 101',
    icon: 'cube-outline',
    name: 'animation-101/index',
  },
  {
    title: 'Animation 102',
    icon: 'albums-outline',
    name: 'animation-102/index',
  },
];

/** Rutas generales de la app (Inicio, Acerca de). */
export const homeMenuRoutes: MenuRoute[] = [
  {
    title: 'Inicio',
    icon: 'home-outline',
    name: 'index',
  },
  {
    title: 'Acerca de',
    icon: 'information-circle-outline',
    name: 'about',
  },
];

// export const initialMenuRoutes: MenuRoute[] = [
//   {
//     title: 'Inicio',
//     icon: 'cube-outline',
//     name: 'index',
//   },
//   {
//     title: 'Acerca de',
//     icon: 'albums-outline',
//     name: 'about',
//   },
// ];

export const allRoutes = [...menuRoutes, ...uiMenuRoutes, ...animationMenuRoutes];

/**
 * Secciones del menú lateral, en el orden en que se muestran.
 * Se construye a partir de los arrays de arriba para no duplicar información.
 */
export const drawerSections: MenuSection[] = [
  { title: 'General', routes: homeMenuRoutes },
  { title: 'Componentes', routes: menuRoutes },
  { title: 'UI', routes: uiMenuRoutes },
  { title: 'Animaciones', routes: animationMenuRoutes },
];

/**
 * Convierte el nombre de una ruta en su URL.
 * `index` -> `/` · `about` -> `/about` · `pull-to-refresh/index` -> `/pull-to-refresh`
 */
export function routeToPath(name: string): string {
  const path = `/${name}`.replace(/\/index$/, '');

  return path === '' ? '/' : path;
}
