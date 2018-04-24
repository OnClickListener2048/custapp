/**
 * Created by zhuangzihao on 2017/9/29.
 */
import {getApi} from './common';
//测试用的公司ID100057
export function loadServiceData(companyid,date='') {

    let params = companyid?{companyid,date}:{date}

    return getApi('/api/v1/services/summary',params);
}


export function loadServiceCompanyProcessData(id,relatedate='') {

    let params = id?{id,relatedate}:{relatedate}

    return getApi('/api/v1.01/companies/schedule',params);
}



//现金流
export function loadCashFlow(companyid ,date='') {
    let params = companyid?{companyid,date}:{date}

    return getApi('/api/v1/services/cashflow',params);
}
//利润表
export function loadProfit(companyid,date='') {
    let params = companyid?{companyid,date}:{date}
    return getApi('/api/v1/services/profit',params);
}

//应收账款 应付账款
export function loadAccounts(companyid,date='',type='1') {
    let params = companyid?{companyid,date,type}:{date,type}

    return getApi('/api/v1/services/accounts',params);
}

//纳税表
export function loadTaxForm(companyid,date='') {
    let params = companyid?{companyid,date}:{date}

    return getApi('/api/v1/services/tax',params);
}

//凭证列表
export function loadVouchers(companyid,date='') {

    return getApi('/api/v1.01/myfinances/vouchers?companycode='+companyid+'&relatedate='+date);
}

//总账列表
export function loadGeneralLedgerData(companyid,date='') {

    return getApi('/api/v1.01/myfinances/generalledger?companycode='+companyid+'&fromdate='+date+'&todate='+date);
}

//科目余额表
export function loadBalancesheet(companyid,date='') {

    return getApi('/api/v1.01/myfinances/balancesheet?companycode='+companyid+'&fromdate='+date+'&todate='+date);
}

//利润表
export function loadProfitPageData(companyid,date='') {

    return getApi('/api/v1.01/myfinances/profit?companycode='+companyid+'&fromdate='+date+'&todate='+date);
}

//现金流量表
export function loadCashFlowSizePageData(companyid,date='') {

    return getApi('/api/v1.01/myfinances/cashflow?companycode='+companyid+'&fromdate='+date+'&todate='+date);
}


//获取科目列表，即明细表
export function loadAccountCategoryList(companycode) {
    return getApi('/api/v1.01/myfinances/subjects?companycode=' + companycode);
}
//记账凭证详情
export function loadVoucherDetail(companycode,date='',id) {
    return getApi('/api/v1.01/myfinances/voucher/detail?companycode=' + companycode + '&relatedate=' + date + '&id=' + id);
}

//明细账详情
export function loadDetialAccountData(companyid,date='',subjectno) {

    return getApi('/api/v1.01/myfinances/detailledger?companycode='+companyid+'&fromdate='+date+'&todate='+date+'&subjectno='+subjectno);
}

//获取是否展示年报
export function loadYearReport(companyid) {

    return getApi('/api/v1/activity/entry',{id:companyid});
}

/***
 * 获取公司账期
 * @param companyid
 * @returns {Promise}
 */
export function loadPayMent(companyid) {

    return getApi('/api/v1.01/companies/relatedate',{id:companyid});
}
//资产负债表
export function loadLiabilityDate(companyid,date='') {
    return getApi(`/api/v1.01/myfinances/liability?companycode=${companyid}&relatedate=${date}`);

}
