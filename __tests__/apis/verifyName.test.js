/**
 * Created by jinglan on 2018/3/28.
 */

import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/verifyName";
import TestHttpAdapter from "../../__mocks__/TestHttpAdapter";

it('getVerifyResultData api', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.loadVerifyResultData('噼里啪', '13511111111','777777');
        expect(result.code).toEqual(0);

    } catch (e) {
        expect(e.code).toEqual(1);
        console.log('getVerifyResultData error');
    }
});


