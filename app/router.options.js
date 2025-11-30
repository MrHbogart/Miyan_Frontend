// Custom scroll behavior: only scroll to top when parent route (branch) changes.
export default {
  scrollBehavior(to, from, savedPosition) {
    // If there is a saved position (back/forward), honor it.
    if (savedPosition) return savedPosition

    // Resolve segments: expected route format: /<lang>/<parent>/<child...>
    const toSegs = (to.path || '').split('/').filter(Boolean)
    const fromSegs = (from && from.path ? from.path : '').split('/').filter(Boolean)

    // Parent is the second segment (index 1) since index 0 is language
    const toParent = toSegs[1] || null
    const fromParent = fromSegs[1] || null

    // If parent changed (navigating between top-level branches), scroll to top.
    if (toParent !== fromParent) {
      return { left: 0, top: 0 }
    }

    // For child route navigations within same parent, keep current scroll position.
    return false
  }
}
