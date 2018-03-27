import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/account";
import TestHttpAdapter from "../../__mocks__/TestHttpAdapter";

it('绑定关联新手机号', async () => {
    TestHttpAdapter.enableLogin = true;
    try {
        let result =  await apis.editPhoneBind('13810397064', '123456');
        console.log('editPhoneBind success');
        fail('should not pass here!');
    } catch (e) {
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("短信验证码无效");
    }
});

it('微信授权token', async () => {
    TestHttpAdapter.enableLogin = false;
    let responseData =  await apis.wechatToken("0");
    console.log("*************", responseData);
    let result = JSON.parse(responseData);
    expect(result.code).toEqual(1);
    expect(result.msg).toEqual("登录失败，请稍后重试");
});

