import Vue from 'vue'
import iView from 'iview'
import App from '@/App.vue'
import Router from 'vue-router'
import store from '@/store/index.ts'
import 'iview/dist/styles/iview.css'
import i18n from '@/language/index.ts'
import router from '@/router/index.ts'
import htmlRem from '@/core/utils/rem.ts'
import {isWindows} from "@/config/index.ts"
import {resetFontSize} from '@/core/utils/electron.ts'

Vue.use(require('vue-moment'))
Vue.use(Router)
//Introduced the global
Vue.use(iView)
htmlRem()
if (isWindows) {
    resetFontSize()
}

Vue.config.productionTip = false

export default new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
