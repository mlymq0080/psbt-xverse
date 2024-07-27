import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router';
import psbtBTC from '../views/psbtBTC.vue'
import psbtRunes from '../views/psbtRunes.vue'
import psbtBurnRunes from '../views/psbtBurnRunes.vue'
const routes = [
  {
    path: '/',
    component: psbtBurnRunes,
    redirect:'/psbtBurnRunes',
    children:[
      {
        path: '/psbtBurnRunes',
        component: psbtBurnRunes
      }
   
    ]
  },

]

const router = createRouter({
  // history: createWebHashHistory(),  // hash路由模式
  history: createWebHistory("/PSBT-XVERSE/"),  // history路由模式
  // scrollBehavior(to, from, savedPosition) {
  //   // 始终滚动到顶部
  //   return { top: 0 }
  // },
  routes
});
export default router
