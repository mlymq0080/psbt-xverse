import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router.js"
import Antd from 'ant-design-vue';


const app = createApp(App)
app.use(router).use(Antd).mount('#app')