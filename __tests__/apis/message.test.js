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
        console.log('getServiceMessageData success');

        // fail('should not pass here!');
    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('getServiceMessageData error');
    }
});