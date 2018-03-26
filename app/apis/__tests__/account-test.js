// import 'react-native';
import React from 'react';
import {NetInfo} from 'react-native';
import 'isomorphic-fetch';// 第三方fetch的真实联网实现, 解决 Failed: fetch is not a function
import fetchMock from 'fetch-mock';
import {login} from '../account';


// 空的mock实现 会抛空引用异常
// jest.mock('NetInfo', () => {
//     return {}
// });

// 下面的代码都已经加到了setJest.js中了
// jest.mock('NetInfo', () => {
//     return {
//         isConnected: {
//             fetch: () => {
//                 return new Promise((accept, resolve) => {
//                     accept(true);
//                 })
//             },
//             addEventListener: jest.fn()
//         }
//     }
// });
// console.log(NetInfo);
// jest.mock('react-native-device-info');

/**
 *
 Failed: Cannot read property 'appVersion' of undefined
 TypeError: Cannot read property 'appVersion' of undefined
 at Object.getVersion (node_modules/react-native-device-info/deviceinfo.js:39:20)
 at Object._callee8$ (app/http/HTTPBase.js:307:53)
 */


test('mock function', () => {
    const sum = jest.fn();
    let val = sum(1, 2);
    console.log(val);
});


test('mock function 的返回值', () => {
    const sum = jest.fn().mockReturnValue('8');
    let val = sum(1, 2);
    console.log(val);
});


test('mock function 的模拟实现', () => {
    const sum3 = jest.fn().mockImplementation(
        (a, b) => {
            return a + b;
        }
    );
    let val = sum3(4, 5);
    expect( sum3(4, 5)).toBe(9);
});

test('account api', async () => {
    fetchMock.post('*', JSON.parse('{"success":true,"code":0,"msg":null,"data":null, "jest": true}'));
    let response = await login("13810397064", "123456");
    console.log(response);
});