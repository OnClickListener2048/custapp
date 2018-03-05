/**
 * Created by jinglan on 2018/3/5.
 */
import {getApi,postApi} from './common';
//获取发票抬头列表
export function loadInvoiceTitleListInfo(tocken) {
    return getApi('/api/v1.01/invoice?username=' + tocken);
}

//获取发票抬头详情
export function loadInvoiceDetialData(id='') {
    return getApi('/api/v1.01/invoice/detail/'+id);
}
