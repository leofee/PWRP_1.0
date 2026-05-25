/* ============================================================
   PRWP Router — Hash-based SPA Router
   ============================================================ */

const Router = (() => {
  const routes = {};
  let currentRoute = null;

  const register = (hash, handler) => {
    routes[hash] = handler;
  };

  const navigate = (hash) => {
    window.location.hash = hash;
  };

  const resolve = () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const handler = routes[hash] || routes['404'];
    if (handler) {
      currentRoute = hash;
      handler(hash);
      updateNavActive(hash);
    }
  };

  const updateNavActive = (hash) => {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
      if (el.dataset.route === hash) {
        el.classList.add('active');
      }
    });
  };

  const init = () => {
    window.addEventListener('hashchange', resolve);
    resolve();
  };

  const getCurrent = () => currentRoute;

  return { register, navigate, resolve, init, getCurrent };
})();
