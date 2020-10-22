
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/plot' },
      // { path: '', component: () => import('pages/Index.vue') },
      { path: '/plot', name: 'sEMG plot', component: () => import('pages/Plot.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
