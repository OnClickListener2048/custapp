/**
 * Created by liufei on 2017/9/29.
 */

import {getApi} from './common';

export function loadOrderListData(companyid='') {
    return getApi('/api/v1/orders',{companyid});
}

export function loadOrderDetailData(id='') {
    return getApi('/api/v1/orders/'+id);
}