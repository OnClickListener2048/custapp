/**
 * Created by jinglan on 2018/3/28.
 */

import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/feedBack";
import TestHttpAdapter from "../../__mocks__/TestHttpAdapter";

it('post submitFeedBack api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.submitFeedBack('注册公司', '北京','名字','13522807924', 'g2vg');
        expect(result.code).toEqual(0);

    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('getServiceMessageData error');
    }
});
