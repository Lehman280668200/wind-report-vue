import { Request } from './Request'
 
 
/**
 * 获取所有数据库信息
 * @param parameter 
 * @returns 
 */
export function listData (parameter: any)  {
    return Request.axiosInstance({
        url: '/db/list',
        method: 'get',
        data: parameter
    })
}

/**
 * 新增数据库信息
 * @param parameter 
 * @returns 
 */
export function saveData (parameter: any)  {
    return Request.axiosInstance({
        url: '/db/save',
        method: 'post',
        data: parameter
    })
}

/**
 * 更新数据库信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function updateData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/db/update/'+id,
        method: 'put',
        data: parameter
    })
}

/**
 * 删除数据库信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function deleteData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/db/delete/'+id,
        method: 'delete',
        data: parameter
    })
}