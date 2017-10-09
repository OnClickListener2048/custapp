/**
 * Created by jinglan on 2017/9/29.
 */
import {getApi} from './common';

export function loadVerifyResultData(keyword = '',mobile = '',vcode = '') {
    return getApi('/api/mock/companies/check',{keyword,mobile,vcode});
}

export function loadVerifyCompaniesList(keyword = '',page = 1,count = 10) {
    return getApi('/api/mock/companies/search',{keyword,page,count});
}

export function loadVerifyCompanyInfo(mobile='') {
    return getApi('/api/mock/companies',{mobile});
}






