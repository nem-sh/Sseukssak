import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
// Optional. When using scrollOverflow:true
import 'fullpage.js/vendors/scrolloverflow'

// Optional. When using fullpage extensions
//import './fullpage.scrollHorizontally.min'

import VueFullPage from './../node_modules/vue-fullpage.js'

Vue.use(VueFullPage);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

