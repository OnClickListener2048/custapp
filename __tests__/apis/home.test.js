/**
 * Created by zhuangzihao on 2018/3/26.
 */
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import * as apis from "../../app/apis/home";

it('loadHomeData api  return code === 0 list is array ', async () => {
    try {
        let result =  await apis.loadHomeData();
        console.log("loadHomeData success", result);
        expect(result.code).toEqual(0);
        expect(result.list instanceof Array).toBeTruthy()


    } catch (e) {
        console.log("error", e);
        expect(e.code).toEqual(1);
    }
});
it('loadHomeBanner api return code === 0 list is array', async () => {
    try {
        let result =  await apis.loadHomeBanner();
        console.log("loadHomeBanner success", result);
        expect(result.code).toEqual(0);
        expect(result.list instanceof Array).toBeTruthy()


    } catch (e) {
        console.log("error", e);
        expect(e.code).toEqual(1);
    }
});

it('loadHomeTipBoxInfo api return code === 0', async () => {
    try {
        let result =  await apis.loadHomeTipBoxInfo();
        console.log("loadHomeTipBoxInfo success", result);
        expect(result.code).toEqual(0);

    } catch (e) {
        console.log("error", e);
        expect(e.code).toEqual(1);
    }

});

it('loadHomeTools api return code === 0 list is array list.length < 5', async () => {
    try {
        let result =  await apis.loadHomeTools();
        console.log("loadHomeTools success", result);
        expect(result.code).toEqual(0);
        expect(result.list instanceof Array).toBeTruthy()
        expect(result.list.length).toBeLessThanOrEqual(4)

    } catch (e) {
        console.log("error", e);
        expect(e.code).toEqual(1);
    }
});
it('loadOtherTools api return code === 0 , list is array', async () => {
    try {
        let result =  await apis.loadHomeTools();
        console.log("loadOtherTools success", result);
        expect(result.code).toEqual(0);
        expect(result.list instanceof Array).toBeTruthy()

    } catch (e) {
        console.log("error", e);
        expect(e.code).toEqual(1);
    }
});
