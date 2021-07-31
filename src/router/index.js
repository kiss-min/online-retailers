import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Longin from '../views/Longin.vue'
import users from '../components/users.vue'
import roles from '../components/roles.vue'
import rights from '../components/rights.vue'
import goods from '../components/goods.vue'
import add from '../components/add.vue'
import orders from '../components/orders.vue'
import categories from '../components/categories.vue'
import reports from '../components/reports.vue'
import update from '../components/update.vue'
import params from '../components/params.vue'


const routes = [{
    path: '/Home',
    name: 'Home',
    component: Home,
    children: [{
        path: '/users',
        name: 'users',
        component: users,
      }, {
        path: '/roles',
        name: 'roles',
        component: roles,
      }, {
        path: '/rights',
        name: 'rights',
        component: rights,
      }, {
        path: '/goods',
        name: 'goods',
        component: goods,
      }, {
        path: '/add',
        name: 'add',
        component: add,
      },
      {
        path: '/orders',
        name: 'orders',
        component: orders,
      },
      {
        path: '/categories',
        name: 'categories',
        component: categories,
      },
      {
        path: '/reports',
        name: 'reports',
        component: reports,
      },
      {
        path: '/params',
        name: 'params',
        component: params,
      },
      {
        path: '/update',
        name: 'update',
        component: update,
      }
    ]
  },
  {
    path: '/',
    name: 'Longin',
    component: Longin
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {

  const str = sessionStorage.getItem('token')
  // console.log(str == true);
  if (!str && to.path != '/') {
    // console.log(1)
    next('/Longin')
  }
  // console.log(2)

  next()


})
Vue.use(VueRouter)
export default router