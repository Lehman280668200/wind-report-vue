import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'homeView',
    component: HomeView,
    redirect:'/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomePage.vue')
      },
      {
        path: '/data-base',
        name: 'data-base',
        component: () => import('../views/data/DataBase.vue')
      },
      {
        path: '/data-source',
        name: 'data-source',
        component: () => import('../views/data/DataSource.vue')
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
      },
      {
        path: '/token',
        name: 'token',
        component: () => import('../views/TokenConfig.vue')
      }
    ]
  },
  {
    path: '/design/:id?',
    name: 'design',
    component: () => import('../components/design/ReportDesign.vue')
  },
  {
    path: '/view/report-data/:data_id/:ds_id',
    name: 'view',
    component: () => import('../components/view/ReportDataRender.vue')
  },
  /*{ 
    path: '/404', 
    name: 'page404',  
    component: () => import('../views/404Page.vue')
  },
  {
    path: '*',
    redirect: '/404',
    name: 'notFound'
   
  }*/
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
