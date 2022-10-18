import { createApp, onBeforeUnmount } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'element-plus/dist/index.css'

// 初始化进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ easing: 'ease', minimum: 0.3, speed: 300, showSpinner: false })

const app = createApp(App)
app.use(store)
app.use(router)

app.mount('#app')
