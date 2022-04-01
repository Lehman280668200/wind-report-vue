import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children: [
      {
        path: '/data-db',
        name: 'data-db',
        component: () => import('../views/data/DBs.vue')
      },
      {
        path: '/data-config',
        name: 'data-config',
        component: () => import('../views/data/DataConfig.vue')
      },
      {
        path: '/report-data',
        name: 'report-data',
        component: () => import('../views/report/ReportData.vue')
      },
      {
        path: '/report-echarts',
        name: 'report-echarts',
        component: () => import('../views/report/ReportEcharts.vue')
      },
      {
        path: '/report-datav',
        name: 'report-datav',
        component: () => import('../views/report/ReportDataV.vue')
      }
    ]
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('../components/design/ReportDesign.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
