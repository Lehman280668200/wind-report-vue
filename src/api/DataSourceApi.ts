import { Request } from './Request'
 
 
/**
 * 获取所有数据源信息
 * @param parameter 
 * @returns 
 */
export function listData (parameter: any)  {
    return Request.axiosInstance({
        url: '/ds/list',
        method: 'get',
        data: parameter
    })
}

/**
 * 新增数据源信息
 * @param parameter 
 * @returns 
 */
export function saveData (parameter: any)  {
    return Request.axiosInstance({
        url: '/ds/save',
        method: 'post',
        data: parameter
    })
}

/**
 * 更新数据源信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function updateData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/ds/update/'+id,
        method: 'put',
        data: parameter
    })
}

/**
 * 删除数据源信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function deleteData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/ds/delete/'+id,
        method: 'delete',
        data: parameter
    })
}

/**
 * 测试连接数据库
 * @param parameter 
 * @param id 
 * @returns 
 */
 export function validateSQL (parameter: any)  {
    return Request.axiosInstance({
        url: '/ds/validate',
        method: 'post',
        data: parameter
    })
}


/**
 * 根据数据源获取数据
 * @param parameter 
 * @param id 
 * @returns 
 */
export function getReportData (parameter:any,id: string) {
    return Request.axiosInstance({
        url: '/ds/report-data/'+id,
        method: 'get',
        data: parameter
    })
}