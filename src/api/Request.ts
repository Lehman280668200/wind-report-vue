import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {message} from 'ant-design-vue'

export class Request {

  

    public static axiosInstance: AxiosInstance
 
    // constructor() {
    //     // 创建axios实例
    //     this.axiosInstance = axios.create({timeout: 1000 * 12})
    //     // 初始化拦截器
    //     this.initInterceptors()
    // }
 
    public static init() {
        // 创建axios实例
        this.axiosInstance = axios.create({
            baseURL: '/api',
            timeout: 6000
        })
        // 初始化拦截器
        this.initInterceptors()
        return axios
    }
 
    // 为了让http.ts中获取初始化好的axios实例
    // public getInterceptors() {
    //     return this.axiosInstance
    // }
 
    // 初始化拦截器
    public static initInterceptors() {
        // 设置post请求头
        this.axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
        /**
         * 请求拦截器
         * 每次请求前，如果存在token则在请求头中携带token
         */
        this.axiosInstance.interceptors.request.use(
            (config: AxiosRequestConfig) => {
 
                const token = localStorage.getItem('ACCESS_TOKEN')
                if (config && config.headers && token) { 
                    config.headers['access_token'] = token
                }
                
                return config
            },
            (error: any) => {
                console.log(error)
            },
        )
 
 
        // 响应拦截器
        this.axiosInstance.interceptors.response.use(
            // 请求成功
            (response: AxiosResponse) => {
                // if (res.headers.authorization) {
                //     localStorage.setItem('id_token', res.headers.authorization)
                // } else {
                //     if (res.data && res.data.token) {
                //         localStorage.setItem('id_token', res.data.token)
                //     }
                // }
                if (response.status === 200) {
                    // return Promise.resolve(response.data)
                    return response
                } else {
                    Request.errorHandle(response)
                    // return Promise.reject(response.data)
                    return response
                }
            },
            // 请求失败
            (error: any) => {
                const {response} = error
                if (response) {
                    // 请求已发出，但是不在2xx的范围
                    Request.errorHandle(response)
                    return Promise.reject(response.data)
                } else {
                    // 处理断网的情况
                    // eg:请求超时或断网时，更新state的network状态
                    // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
                    // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
                    message.warn('网络连接异常,请稍后再试!')
                }
            })
    }
 
 
    /**
     * http握手错误
     * @param res 响应回调,根据不同响应进行不同操作
     */
    private static errorHandle(res: any) {
        // 状态码判断
        switch (res.status) {
            case 401:
                break
            case 403:
                //res.sendRedirect("www.baidu.com")
                message.warn(res.data.msg?res.data.msg:'403 token过期或错误')
                break
            case 404:
                message.warn('请求的资源不存在')
                break
            default:
                message.warn('连接错误')
        }
    }
 
 
}