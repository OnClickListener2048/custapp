import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/account";

it('editPhoneBind api', async () => {
    try {
        let result =  await apis.editPhoneBind('13810397064', '123456');
        console.log("*************", result);
        console.log('editPhoneBind success');
        fail('should not pass here!');
    } catch (e) {
        console.log("eeeeeeeeeee", e);
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("短信验证码无效");
    }
});