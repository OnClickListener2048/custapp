/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi} from './common';

export function loadServiceData(companyid,date='') {

    let params = companyid?{companyid,date}:{date}

    return getApi('/api/mock/services/summary',params);
}

//现金流
export function loadCashFlow(companyid ,date='') {
    let params = companyid?{companyid,date}:{date}

    return getApi('/api/mock/services/cashflow',params);
}
//利润表
export function loadProfit(companyid,date='') {
    let params = companyid?{companyid,date}:{date}

    return getApi('/api/mock/services/profit',params);
}

//应收账款 应付账款
export function loadAccounts(companyid,date='',type='1') {
    let params = companyid?{companyid,date,type}:{date,type}

    return getApi('/api/mock/services/accounts',params);
}

//纳税表
export function loadTaxForm(companyid,date='') {
    let params = companyid?{companyid,date}:{date}

    return getApi('/api/mock/services/tax',params);
}

