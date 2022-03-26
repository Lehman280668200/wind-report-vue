import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '/report-data',
        name: 'report-data',
        component: () => import('../views/ReportData.vue')
      },
      {
        path: '/report-echarts',
        name: 'report-echarts',
        component: () => import('../views/ReportEcharts.vue')
      },
      {
        path: '/report-datav',
        name: 'report-datav',
        component: () => import('../views/ReportDataV.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
