import dayjs from "dayjs"


/**
 * 根据不同数据类型 处理排序和筛选
 * @param columns 
 * @returns 
 */
export function columnConvert (columns:any) {

    for(let i=0;i<columns.length;i++){
        const dataIndex = columns[i].dataIndex
       switch(columns[i].dataType){
         case 'string':
           if(columns[i].sorter)  columns[i].sorter = (a:any, b:any) => a[dataIndex].length - b[dataIndex].length
           if(columns[i].search){
               columns[i].customFilterDropdown = true
               columns[i].onFilter = (value:any, record:any) =>{ return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) }  
           }
           break
         case 'number':
           if(columns[i].sorter) columns[i].sorter = (a:any, b:any) => a[dataIndex] - b[dataIndex]
           if(columns[i].search){
               columns[i].customFilterDropdown = true
               columns[i].arithmetic = '=' //  追加一个算术运算符
               columns[i].onFilter = (value:any, record:any) => {
                 if(columns[i].arithmetic=='='){
                    return record[dataIndex]==value
                 }else if(columns[i].arithmetic=='>'){
                    return record[dataIndex]>value
                 }else if(columns[i].arithmetic=='<'){
                    return record[dataIndex]<value
                 }else if(columns[i].arithmetic=='!='){
                    return record[dataIndex]!=value
                 }else if(columns[i].arithmetic=='>='){
                    return record[dataIndex]>=value
                 }else if(columns[i].arithmetic=='<='){
                    return record[dataIndex]<=value
                 }else{
                    return true
                 }
               } 
           }
           break
         case 'date':
           if(columns[i].sorter) columns[i].sorter = (a:any, b:any) =>  dayjs(a[dataIndex]).diff(dayjs(b[dataIndex]))
           if(columns[i].search){
             columns[i].customFilterDropdown = true
             columns[i].arithmetic = '=' //  追加一个算术运算符
             columns[i].dateType = 'date' //  追加一个时间类型
             columns[i].onFilter = (value:any, record:any) => {
                 let size = 'day'  //  计算的颗粒度
                 if(columns[i].dateType=='date') size = 'day'
                 else if (columns[i].dateType=='month') size = 'month'
                 else if (columns[i].dateType=='year') size = 'year'
                 else if (columns[i].dateType=='second') size = 'second'
                 if(columns[i].arithmetic=='='){
                   return dayjs(record[dataIndex]).diff(value,(size as any))==0?true:false
                 }else if(columns[i].arithmetic=='>'){
                   return dayjs(record[dataIndex]).diff(value,(size as any))>0?true:false
                 }else if(columns[i].arithmetic=='<'){
                   return dayjs(record[dataIndex]).diff(value,(size as any))<0?true:false
                 }else if(columns[i].arithmetic=='!='){
                   return dayjs(record[dataIndex]).diff(value,(size as any))!=0?true:false
                 }else if(columns[i].arithmetic=='>='){
                   return dayjs(record[dataIndex]).diff(value,(size as any))>=0?true:false
                 }else if(columns[i].arithmetic=='<='){
                   return dayjs(record[dataIndex]).diff(value,(size as any))<=0?true:false
                 }else{
                    return true
                 }
               } 
           }
           break
         case 'json':
           if(columns[i].sorter){
             columns[i].sorter = (a:any, b:any) =>  typeof(a[dataIndex])=='number'&&typeof(b[dataIndex])=='number'?a[dataIndex] - b[dataIndex]:a[dataIndex].length - b[dataIndex].length
           } 
           if(columns[i].search){
               columns[i].filters = JSON.parse(columns[i].json)
               columns[i].jsonData = (data:any) =>{
                 for(let f=0;f<columns[i].filters.length;f++){
                   if(columns[i].filters[f].value==data){
                     return columns[i].filters[f].text
                   }
                 } 
               }
               columns[i].onFilter = (value: any, record: any) => { return record[dataIndex]==value}
           }
           break      
       }
     }

     return columns
}