import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import './assets/styles/index.less'
import { Request } from './api/Request'
import VueAxios from 'vue-axios'


const app = createApp(App);

app.use(Antd); // Antd UI
app.use(router); // router 路由
app.use(VueAxios, Request.init());
app.mount('#app');
