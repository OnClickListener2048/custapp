/**
 * Created by zhuangzihao on 2018/3/5.
 */
import {getApi} from './common';


// 获取订单 公司 抬头 个数
export function loadMinePageNumber( ) {
    return getApi('/api/v1/user/resources/count');
}
