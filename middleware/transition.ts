export default defineNuxtRouteMiddleware((to, from) => {
    if (to.meta.pageTransition && typeof to.meta.pageTransition !== 'boolean') {
      const fromOrder = getRouteOrder(from.path)
      const toOrder = getRouteOrder(to.path)
      to.meta.pageTransition.name = toOrder > fromOrder ? 'slide-right' : 'slide-left'
    }
  })
  
  function getRouteOrder(path: string): number {
    switch (path) {
      case '/': return 0
      case '/auth': return 1
      case '/dashboard/home': return 2
      case '/dashboard/gallery': return 3
      case '/dashboard/make': return 4
      case '/admin': return 5
      case '/profile': return 6
      default: return 999 
    }
  }
  