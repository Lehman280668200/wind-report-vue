import { Request } from './Request'
 
 
/**
 * 分特获取所有数据报表信息
 * @param parameter 
 * @returns 
 */
export function pageData (parameter: any,pageNo: number,pageSize: number)  {
    return Request.axiosInstance({
        url: `/report/data/page?pageNo=${pageNo}&pageSize=${pageSize}`,
        method: 'get',
        data: parameter
    })
}

/**
 * 获取指定的数据报表信息
 * @param parameter 
 * @param id 
 * @returns 
 */
 export function getData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/report/data/get/'+id,
        method: 'get',
        data: parameter
    })
}

/**
 * 新增数据报表信息
 * @param parameter 
 * @returns 
 */
export function saveData (parameter: any)  {
    return Request.axiosInstance({
        url: '/report/data/save',
        method: 'post',
        data: parameter
    })
}

/**
 * 更新数据报表信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function updateData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/report/data/update/'+id,
        method: 'put',
        data: parameter
    })
}

/**
 * 删除数据报表信息
 * @param parameter 
 * @param id 
 * @returns 
 */
export function deleteData (parameter: any,id: string)  {
    return Request.axiosInstance({
        url: '/report/data/delete/'+id,
        method: 'delete',
        data: parameter
    })
}