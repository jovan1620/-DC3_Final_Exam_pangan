import HomeView from '../views/HomeView.vue'
import MenuItemsView from '../views/MenuItemsView.vue'
import OrdersView from '../views/OrdersView.vue'
import DashboardView from '../views/DashboardView.vue'

// Vue Router demonstrates SPA navigation without reloading the page.
export default [
  { path: '/', name: 'home', component: HomeView },
  { path: '/menu', name: 'menu', component: MenuItemsView },
  { path: '/orders', name: 'orders', component: OrdersView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
