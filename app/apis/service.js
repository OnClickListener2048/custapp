/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi} from './common';

export function loadServiceData(companyid = '1',date='') {
    return getApi('/api/mock/services/summary',{companyid,date});
}

//现金流
export function loadCashFlow(companyid = '1',date='') {
    return getApi('/api/mock/services/cashflow',{companyid,date});
}
//利润表
export function loadProfit(companyid = '1',date='') {
    return getApi('/api/mock/services/profit',{companyid,date});
}

//应收账款 应付账款
export function loadAccounts(companyid = '1',date='',type='1') {
    return getApi('/api/mock/services/accounts',{companyid,date,type});
}

//纳税表
export function loadTaxForm(companyid = '1',date='') {
    return getApi('/api/mock/services/tax',{companyid,date});
}

