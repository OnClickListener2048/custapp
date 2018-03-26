/**
 * Created by jinglan on 2018/3/26.
 */
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/message";
import TestHttpAdapter from "../../__mocks__/TestHttpAdapter";

it('getServiceMessageData api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.loadMessageData(10, 1);
        expect(result.code).toEqual(0);

        // if (result.code === 0){
        //     console.log('getServiceMessageData success');
        //     console.log("*************请求成功");
        // }else {
        //     fail('should not pass here!');
        // }
    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('getServiceMessageData error');
    }
});


it('getMessageUnreadNum api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.loadMessageUnReadedNum();
        expect(result.code).toEqual(0);

        // if (result.code === 0){
        //     console.log('getServiceMessageData success');
        //     console.log("*************请求成功");
        // }else {
        //     fail('should not pass here!');
        // }
    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('getMessageUnreadNum error');
    }
});

it('putClearMessageUnreadNum api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.putClearMessageUnReadedNum();
        expect(result.code).toEqual(0);

        // if (result.code === 0){
        //     console.log('getServiceMessageData success');
        //     console.log("*************请求成功");
        // }else {
        //     fail('should not pass here!');
        // }
    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('putClearMessageUnreadNum error');
    }
});


it('postMessageReadedID api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.postMessageReaded('11');
        expect(result.code).toEqual(0);

        // if (result.code === 0){
        //     console.log('getServiceMessageData success');
        //     console.log("*************请求成功");
        // }else {
        //     fail('should not pass here!');
        // }
    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('putClearMessageUnreadNum error');
    }
});