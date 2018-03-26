/**
 * Created by zhuangzihao on 2018/3/26.
 */
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/invoice";


describe('loadInvoiceTitleListInfo api', () => {

    it('without tocken should return code === 1', async () => {

        try {
            let result =  await apis.loadInvoiceTitleListInfo();
            console.log("loadInvoiceTitleListInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("username不能为空!!!");
        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.loadInvoiceTitleListInfo('97b0efb7-4ae1-4019-a2a8-e51842d54e3f');
            console.log("loadInvoiceTitleListInfo success", result);
            expect(result.code).toEqual(0);
            expect(result.list instanceof Array).toBeTruthy()

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
        }
    });

});



describe('loadInvoiceDetialData api', () => {

    it('without or error id should return code === 1', async () => {

        try {
            let result =  await apis.loadInvoiceDetialData('1');
            console.log("loadInvoiceDetialData success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("获取发票抬头详情失败!!!");

        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.loadInvoiceDetialData('5a9d01e5966b5e001a96fe85');
            console.log("loadInvoiceDetialData success", result);
            expect(result.code).toEqual(0);
            expect(result.data).toHaveProperty('_id');
            expect(result.data).toHaveProperty('company');
            expect(result.data).toHaveProperty('taxID');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
        }
    });

});


describe('deleteInvoiceTitle api', () => {

    it('without or error id should return code === 1', async () => {

        try {
            let result =  await apis.deleteInvoiceTitle('1');
            console.log("deleteInvoiceTitle success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("删除失败!!!");

        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.deleteInvoiceTitle('5a795853591b3578cfcc0830');
            console.log("deleteInvoiceTitle success", result);
            expect(result.code).toEqual(0);
            expect(result.msg).toEqual("删除成功!!");


        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
        }
    });

});

describe('verifyInvoice api', () => {

    let params = {
        FPDM:"012001700111",
        FPHM:"19903129",
        KPRQ:"20171219",
        FPLX:"04",
        JYM:"214506"
    }

    it('without  step should return code === 1', async () => {

        try {
            let result =  await apis.verifyInvoice('',params);
            console.log("verifyInvoice success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("验证步骤不能为空!");

        }
    });

    it('without  params should return code === 1', async () => {

        try {
            let result =  await apis.verifyInvoice('',{});
            console.log("verifyInvoice success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual("1");
            expect(e.msg).toEqual("发票类型不在查询范围!!!");

        }
    });

    it('step === 1 success code === 0 ', async () => {

        try {
            let result =  await apis.verifyInvoice('1',params);
            console.log("verifyInvoice success", result);
            expect(result.code).toEqual(0);
            expect(result).toHaveProperty('data');


        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual("1");
        }
    });

    it('step === 2 success code === 0 ', async () => {

        try {
            let result =  await apis.verifyInvoice('2',params);
            console.log("verifyInvoice success", result);
            expect(result.code).toEqual(0);
            expect(result).toHaveProperty('data');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual("1");
        }
    });

});


describe('verifyInvoiceIsSave api', () => {

    it('without  company should return code === 1', async () => {

        try {
            let result =  await apis.verifyInvoiceIsSave('11','');
            console.log("verifyInvoiceIsSave success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("公司名称不能为空!!!");

        }
    });

    it('without  username should return code === 1', async () => {

        try {
            let result =  await apis.verifyInvoiceIsSave('','22');
            console.log("verifyInvoiceIsSave success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("用户username不能为空!!!");

        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.verifyInvoiceIsSave('11','22');
            console.log("verifyInvoiceIsSave success", result);
            expect(result.code).toEqual(0);
            expect(result.status instanceof Array).toBeTruthy()


        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);

        }
    });

})


describe('updateInvoiceInfo api', () => {
    it('without or error  _id should return code === 1', async () => {

        try {
            let result =  await apis.updateInvoiceInfo('1',{
                company:'北京爱康鼎',
                taxID:'91110108344327090E'
            });
            console.log("updateInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("修改失败!!!");

        }
    });

    it('without or error  company should return code === 1', async () => {

        try {
            let result =  await apis.updateInvoiceInfo('1',{});
            console.log("updateInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("公司名称不能为空!!!");

        }
    });

    it('without or error  taxID should return code === 1', async () => {

        try {
            let result =  await apis.updateInvoiceInfo('1',{company:'北京爱康鼎'});
            console.log("updateInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("税号不能为空!!!");

        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.updateInvoiceInfo('111',{company:'北京爱康鼎',taxID:'1111'});
            console.log("updateInvoiceInfo success", result);
            expect(result.code).toEqual(0);
            expect(e.msg).toEqual("修改成功!!");


        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("修改失败!!!");

        }
    });


})



describe('addInvoiceInfo api', () => {

    it('without username should return code === 1', async () => {

        try {
            let result =  await apis.addInvoiceInfo({

            });
            console.log("addInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("username不能为空!!!");

        }
    });

    it('without company should return code === 1', async () => {

        try {
            let result =  await apis.addInvoiceInfo({
                username:'111'
            });
            console.log("addInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("公司名称不能为空!!!");

        }
    });

    it('without taxID should return code === 1', async () => {

        try {
            let result =  await apis.addInvoiceInfo({
                username:'111',
                company:'222'
            });
            console.log("addInvoiceInfo success", result);
            fail('should not pass here!');

        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("税号不能为空!!!");

        }
    });

    it('success should return code === 0', async () => {

        try {
            let result =  await apis.addInvoiceInfo({
                username:'111',
                company:'222',
                taxID:'333'

            });
            console.log("addInvoiceInfo success", result);
            expect(result.code).toEqual(0);
            expect(result.msg).toEqual("新增发票抬头成功!!");
            expect(result.data).toHaveProperty('_id');


        } catch (e) {
            console.log("error", e);
            expect(e.code).toEqual(1);
            expect(e.msg).toEqual("该公司已存储发票抬头!!");

        }
    });

})