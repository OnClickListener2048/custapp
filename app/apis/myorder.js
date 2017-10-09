/**
 * Created by liufei on 2017/9/29.
 */

import {getApi} from './common';

export function loadOrderListData() {
    return getApi('/api/mock/orders');
}
