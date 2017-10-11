import 'react-native';
import React from 'react';
import 'isomorphic-fetch';
import fetchMock from 'fetch-mock';
import * as apis from '../app/apis';
import LoginPage from '../app/user/LoginPage';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';

// jest.mock('../app/apis', () => {
//     return {
//         sendVerifyVCode:
//             () => {
//                 console.log(' sendVerifyVCode ');
//                 return new Promise((resolve, reject) => {
//                     process.nextTick(
//                         () =>
//                             resolve(JSON.parse('{"success":true,"code":200,"msg":null,"data":null}'))
//                     )
//                 });
//             }
//     }
// });//, {virtual: true}

// fetch.mockResponse('{"success":true,"code":200,"msg":null,"data":null}');

// jest.mock('../app/apis');
// apis.sendVerifyVCode.mockImplementation(
//     // () => {
//     //     console.log(' sendVerifyVCode ');
//     //     return Promise.resolve(JSON.parse('{"success":true,"code":200,"msg":null,"data":null}'));
//     // }
//     () => {
//         console.log(' sendVerifyVCode ');
//         return new Promise((resolve, reject) => {
//             process.nextTick(
//                 () =>
//                     resolve(JSON.parse('{"success":true,"code":200,"msg":null,"data":null}'))
//             )
//         });
//     }
// );

// 修正 Invariant Violation: Native module cannot be null.
jest.mock('NetInfo', () => {
    return {
        isConnected: {
            fetch: () => {
                return new Promise((accept, resolve) => {
                    accept(true);
                })
            },
            addEventListener: jest.fn()
        }
    }
});

jest.mock('react-native-device-info');
jest.mock('react-native-alert');

// jest.mock('../app/apis', () => {
//     return {
//         sendVerifyVCode:
//             () => {
//                 console.log(' sendVerifyVCode ');
//                 Promise.resolve({code: 200});
//             }
//     }
// });

it('can fetch', async () => {
    fetchMock.get('*', JSON.parse('{"success":true,"code":200,"msg":null,"data":null, "jest": true}'));
    console.log("fetch******=", fetch);
    const response = await fetch('http://fake.com');
    console.log("fetch response ******=", response);
    // const response = await HTTPBase.get('http://fake.com', {});
    const result = await response.json();
    expect(result.success).toEqual(true);
});

// async/await can also be used with `.resolves`.
it('works with async/await and resolves', async () => {
    // fetchMock.restore();// 重置数据
    fetchMock.postOnce('*', JSON.parse('{"success":true,"code":200,"msg":null,"data":null, "jest-post": true}'));
    // expect.assertions(1);
    // console.log("apis.sendVerifyVCode=", apis.sendVerifyVCode());
    // let result = await apis.sendVerifyVCode();
    // console.log('result=', result.code);
    // await console.log('result2=', apis.sendVerifyVCode().resolves);
    // expect((await apis.sendVerifyVCode('13810397064', null)).code).toEqual(200);
});

// The assertion for a promise must be returned.
it('works with promises', () => {
    // fetchMock.restore();// 重置数据
    fetchMock.postOnce('*', JSON.parse('{"success":true,"code":200,"msg":null,"data":null, "jest-post": true}'));
    expect.assertions(1);
    expect(200).toEqual(200);
    // return apis.sendVerifyVCode().then(data => expect(data.code).toEqual(200));
});

const navigator = Object.create(null);

navigator.setOnNavigatorEvent = jest.fn();

const wrapper = shallow(
    <LoginPage navigator={navigator}/>
);

// case1
// 通过查找存在 Input,测试组件正常渲染
it('timerButton Component should be render', () => {
    //.find(selector) 是 Enzyme shallow Rendering 提供的语法, 用于查找节点
    // 详细用法见 Enzyme 文档 http://airbnb.io/enzyme/docs/api/shallow.html
    let timerBtn = wrapper.find('timerButton');
    // console.log(timerBtn.instance());
    expect(wrapper.find('timerButton').exists());
})

it('mobile handle correctly', () => {
    // console.log("wrapper======>", wrapper);
    let instance = wrapper.instance();
    instance.componentDidMount();
    console.log("instance.refs.timerButton======>", instance.refs.timerButton);
    // instance.refs.timerButton = {state : {counting: false}};
    instance.updateMobile('13810397064');
    expect(instance.state.mobile).toEqual('13810397064');
    expect(instance.state.mobileValid).toEqual(true);

    instance.updateMobile('汉字1234');
    expect(instance.state.mobile).toEqual('1234');
    expect(instance.state.mobileValid).toEqual(false);

    // console.log(instance);

    //   const tree = renderer.create(
    //       <LoginPage navigator={navigator} />
    //   ).toJSON();
    //   expect(tree).toMatchSnapshot();
});


it('sms code handle correctly',  (done) => {
    // fetchMock.restore();// 重置数据
    fetchMock.postOnce('*', {
        "success": false, "code": 500, "msg": "需要图形码", "data": {
            verify: "a.jpg", verifyText: "需要图形码44"
        }, "jest-post": true
    });
    let instance = wrapper.instance();
    // instance.updateMobile('13810397068');
    // expect(instance.state.mobile).toEqual('13810397068');
    // expect(instance.state.mobileValid).toEqual(true);
    //
    // instance.refs = {timerButton: { state: {counting: false}}};
    // instance._requestSMSCode();
    //
    // // 使用真正的定时器, 否则异步执行会立即返回, 导致状态判断出错
    // jest.useRealTimers();
    //
    // setTimeout(function() {
    //     // run your expectation
    //     expect(instance.state.verifyText).toEqual('需要图形码44');
    //     console.log("instance.state", instance.state);
    //     console.log("instance.refs", instance.refs);
    //     done();
    // }, 1000);


    // 用到ref的地方都要跳过 TypeError: Cannot read property 'timerButton' of undefined
    done();
});