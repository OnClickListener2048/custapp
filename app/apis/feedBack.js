/**
 * Created by jinglan on 2017/10/16.
 */
import {postApi} from './common';

// export function submitFeedBack(from = '',producname = '',city = '',name = '',tel = '',text = '') {
//     //type 1.产品页 2 APP反馈 3 核名电话   producname 产品名称  text 留言内容
//     return postApi('/api/v1/feedbacks',{from,producname,city,name,tel,text});
// }

export function submitFeedBack(from = '',city = '',name = '',tel = '',text = '') {
    //type 1.产品页 2 APP反馈 3 核名电话   producname 产品名称  text 留言内容
    return postApi('/api/v1/feedbacks',{from,city,name,tel,text});
}





