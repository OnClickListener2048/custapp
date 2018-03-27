/**
 * Created by jiaxueting on 2018/3/26.
 */
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/service";
//获取公司账期
it('loadPayMent api companyid = null', async () => {
    try {
        let result =  await apis.loadPayMent('');
        console.log("输出返回结果=", result);
        fail('should not pass here!');
    } catch (e) {
        console.log("失败=", e);
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("公司id不能为空!!!");
    }
});

it('loadPayMent api', async () => {
    let result =  await apis.loadPayMent('10000');
    console.log("输出返回结果=", result);
    // fail('should not pass here!');
});


//获取是否展示年报

it('loadYearReport api companyid = null',async () => {
   try{
       let result = await  apis.loadYearReport('');
       console.log("输出是否展示年报=",result);
       fail('should not pass here!');
   } catch (e) {
       console.log("失败=",e);
       expect(e.code).toEqual(1);
       expect(e.msg).toEqual("公司id不能为空!")
   }
});

it('loadYearReport api',async () => {
    let result = await apis.loadYearReport('10000');
    console.log("输出是否展示年报=",result);
});

//纳税表
it('loadTaxForm api companyid = null',async () => {
    let result = await apis.loadTaxForm('');
    console.log("输出纳税表=",result);
});

it('loadTaxForm api',async () => {
    let result = await apis.loadTaxForm('0','2017-10');
    console.log("输出纳税表=",result);
});

//应收账款 应付账款
it('loadAccounts api companyid = null',async () => {
    let result = await apis.loadAccounts('');
    console.log("应收账款 应付账款=",result);
});

it('loadAccounts api',async () => {
    let result = await apis.loadAccounts('100071','2017-07');
    console.log("应收账款 应付账款=",result);
});

//利润表
it('loadProfit api companyid = null',async () => {
    let result = await apis.loadProfit('');
    console.log("利润表=",result);
});

it('loadProfit api',async () => {
    let result = await apis.loadProfit('99999','2016-06');
    console.log("利润表=",result);
});

//现金流
it('loadCashFlow api companyid = null',async () => {
    let result = await apis.loadCashFlow('');
    console.log("现金流=",result);
});

it('loadCashFlow api',async () => {
    let result = await apis.loadCashFlow('0','2016-06');
    console.log("现金流=",result);
});

//loadServiceCompanyProcessData
it('loadServiceCompanyProcessData api companyid = null', async () => {
    try {
        let result =  await apis.loadServiceCompanyProcessData('','');
        console.log("输出返回结果=", result);
        fail('should not pass here!');
    } catch (e) {
        console.log("失败=", e);
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("公司id不能为空!!!");
    }
});

it('loadServiceCompanyProcessData api date = null', async () => {
    try {
        let result =  await apis.loadServiceCompanyProcessData('100057','');
        console.log("输出返回结果=", result);
        fail('should not pass here!');
    } catch (e) {
        console.log("失败=", e);
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("日期不能为空!!!");
    }
});

it('loadServiceCompanyProcessData api',async () => {
    let result = await apis.loadServiceCompanyProcessData('0','2016-06');
    console.log("loadServiceCompanyProcessData=",result);
});

//测试用的公司ID100057
it('loadServiceData api companyid = null',async () => {
    let result = await apis.loadServiceData('');
    console.log("测试用的公司ID100057=",result);
});

it('loadServiceData api',async () => {
    let result = await apis.loadServiceData('100057');
    console.log("测试用的公司ID100057=",result);
});