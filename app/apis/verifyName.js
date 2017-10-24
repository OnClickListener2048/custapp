/**
 * Created by jinglan on 2017/9/29.
 */
import {getApi} from './common';


export function loadVerifyResultData(keyword = '',mobile = '',vcode = '') {
    return getApi('/api/v1/companies/check',{keyword,mobile,vcode});
}

export function loadVerifyCompaniesList(keyword = '',page = 1,count = 10) {
    return getApi('/api/v1/companies/search',{keyword,page,count});
}

export function loadVerifyCompanyInfo(mobile='') {
    return getApi('/api/v1/companies',{mobile});
}






/**
 *
 * export function loadVerifyResultData(keyword = '',mobile = '',vcode = '') {
    return getApi('/api/v1/companies/check',{keyword,mobile,vcode});
}



 * export function loadVerifyResultData(keyword = '',mobile = '',vcode = '') {
    return getApi('/api/v1/companies/check?keyword='+keyword+'&mobile='+mobile+'&vcode='+vcode);
}
 */
