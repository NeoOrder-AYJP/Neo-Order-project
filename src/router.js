// Simple Hash-based Router
export class Router {
  constructor(routes, defaultRoute = 'inicio-cardapio') {
    this.routes = routes;
    this.defaultRoute = defaultRoute;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  navigate(route) {
    window.location.hash = `#${route}`;
  }

  getCurrentRoute() {
    return window.location.hash.replace(/^#/, '') || this.defaultRoute;
  }

  handleRoute() {
    const route = this.getCurrentRoute();
    const handler = this.routes[route] || this.routes[this.defaultRoute];
    if (handler) {
      handler(route);
    }
  }
}
