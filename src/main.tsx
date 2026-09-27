import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ViteReactSSG } from 'vite-react-ssg';

import { routes } from './App';
import './index.css';

// vite-react-ssg attaches a client-side "static loader" to every route, but the pre-rendered
// hydration data has no entry for routes without real loaders. React Router then treats every
// route as unloaded and renders an empty HydrateFallback during hydration, which mismatches
// the server HTML and leaves a duplicate (blank + footer) tree above the real page. None of
// our routes use loaders, so strip them before creating the router.
function stripLoaders(routeList: RouteObject[]): RouteObject[] {
  return routeList.map((route) => {
    const stripped = { ...route, loader: undefined } as RouteObject;
    if (route.children) stripped.children = stripLoaders(route.children);
    return stripped;
  });
}

export const createRoot = ViteReactSSG({
  routes,
  customCreateRouter: (routeList, opts) => createBrowserRouter(stripLoaders(routeList), opts),
});
