/**
 * Created by liufei on 2017/9/29.
 */

import {getApi} from './common';

export function loadOrderListData(companyid='1') {
    return getApi('/api/mock/orders',{companyid});
}

export function loadOrderDetailData(orderno='') {
    return getApi('/api/mock/orders/'+{orderno});
}