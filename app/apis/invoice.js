/**
 * Created by jinglan on 2018/3/5.
 */
import {getApi,postApi,deleteApi,putEx} from './common';
//获取发票抬头列表
export function loadInvoiceTitleListInfo(tocken = '') {

    return getApi('/api/v1.01/invoice?username=' + tocken);
}

//获取发票抬头详情
export function loadInvoiceDetialData(id='') {
    return getApi('/api/v1.01/invoice/detail/'+id);
}

// 删除发票抬头
export async function deleteInvoiceTitle(id='') {
    return await deleteApi('/api/v1.01/invoice/'+id);
}

//识别发票真伪接口
export function verifyInvoice(step = '',params) {
    return postApi('/api/v1/receipt/verify?step=' + step,params);
}
//验证发票抬头是否存在接口
export function verifyInvoiceIsSave(username='',company='') {
    return getApi('/api/v1.01/invoice/exist',{username,company});
}
//更新发票抬头信息
export function updateInvoiceInfo(_id,company) {
    return putEx('/api/v1.01/invoice/'+_id,company);
}
//添加发票抬头
export function addInvoiceInfo(params) {
    return postApi('/api/v1.01/invoice', params);
}