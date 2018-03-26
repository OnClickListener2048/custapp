/**
 * Created by jiaxueting on 2018/3/26.
 */
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/service";

it('loadPayMent api', async () => {
    try {
        let result =  await apis.loadPayMent('10000');
        console.log("输出返回结果=", result);
        // fail('should not pass here!');
    } catch (e) {
        console.log("失败=", e);
        expect(e.code).toEqual(1);
        expect(e.msg).toEqual("公司id不能为空!!!");
    }
});