import Vue from 'vue'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import App from './App'


Vue.use(VueResource)
Vue.use(VueMaterial)

Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'red'
  },
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
