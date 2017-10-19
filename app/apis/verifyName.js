/**
 * Created by jinglan on 2017/9/29.
 */
import {getApi} from './common';

export function loadVerifyCode(mobile = '',type = '5') {
    return getApi('/api/vo/verificode/send',{mobile,type});
}

export function loadVerifyResultData(keyword = '',mobile = '',vcode = '') {
    return getApi('/api/v1/companies/check',{keyword,mobile,vcode});
}

export function loadVerifyCompaniesList(keyword = '',page = 1,count = 10) {
    return getApi('/api/v1/companies/search',{keyword,page,count});
}

export function loadVerifyCompanyInfo(mobile='') {
    return getApi('/api/v1/companies',{mobile});
}






