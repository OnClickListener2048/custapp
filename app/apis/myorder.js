/**
 * Created by liufei on 2017/9/29.
 */

import {getApi} from './common';

export function loadOrderListData(mobile) {
    return getApi('/api/v1.01/orders',{mobile});
}

export function loadOrderDetailData(id='') {
    return getApi('/api/v1/orders/'+id);
}