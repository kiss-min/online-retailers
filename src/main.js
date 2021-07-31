import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/c.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.myaxios = axios
axios.defaults.baseURL="http://122.112.253.28:8888/api/private/v1/"
axios.interceptors.request.use((config) => {
  if (config.url != 'login') {
    const token = sessionStorage.getItem('token')
    config.headers.Authorization = token
    // console.log(config)
  }
  return config
})
Vue.config.productionTip = false
Vue.component("tree-table",ZkTable)
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
