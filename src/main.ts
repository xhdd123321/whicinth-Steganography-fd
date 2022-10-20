import { createApp, onBeforeUnmount } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css'

// 初始化进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', minimum: 0.3, speed: 300, showSpinner: false })

const app = createApp(App)
app.use(store)
app.use(router)
app.use(ArcoVueIcon)

app.mount('#app')
