/**
 * Created by liufei on 2018/3/26.
 */

import React from 'react';
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/mine";
import TestHttpAdapter from "../../__mocks__/TestHttpAdapter";


it('获取企业，订单，抬头的个数', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
    let result =  await apis.loadMinePageNumber();
    console.log("*************", result);
    expect(result.code).toEqual(0);
    // expect(result.msg).toEqual("登录失败，请稍后重试");
    } catch (e) {
        expect(e.code).toEqual(1);
    }
});

