import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import './components/icon'
import 'vue-g2'
import G2 from '@antv/g2'

import 'babel-polyfill'
require('babel-polyfill')

import x2js from 'x2js' //xml数据处理插件
Vue.prototype.$x2js = new x2js() //创建x2js对象，挂到vue原型上

Vue.use(G2)


import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

import lodash from 'lodash'
Vue.prototype.$_ = lodash

//轮播
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

// 图表库
import VCharts from 'v-charts'
Vue.use(VCharts)

// 全局过滤器
import filters from './filters'

import './plugins/element.js'
Object.keys(filters).forEach((filterName) => {
    Vue.filter(filterName, filters[filterName])
})


// i18n
import i18n from './i18n'

new Vue({
    router,
    i18n,
    data() {
        return {
            locale: this.$i18n.messages[this.$i18n.locale],
        }
    },
    render: (h) => h(App),
}).$mount('#app')