/**
 * Created by jinglan on 2017/8/18.
 */
import 'react-native';
import React from 'react';
import fetchMock from 'fetch-mock';
import * as apis from '../../../apis/index';
import MyOutSideTaskPage from '../MyOutSideTaskPage';
import {shallow} from 'enzyme';

const navigator = Object.create(null);

navigator.setOnNavigatorEvent = jest.fn();
navigator.setButtons = jest.fn();
navigator.push = jest.fn();

const wrapper = shallow(
    <MyOutSideTaskPage navigator={navigator}/>
);
fetchMock.get('https://app.i-counting.cn/app/v0/outsource/task',
    JSON.parse('{"success":true,"code":200,"msg":null,"data":{"contactName":"1","contactPhone":"1vbj","corpName":"测试测试","salesmanName":"zhangsa","salesmanPhone":"13581665456","taskId":788,"taskName":"其他","taskStatus":"待分配","steps":[{"stepContact":"张经兰","stepId":"3879","stepName":"交社保","stepStatus":"进行中","outWorkerId":"1337","subsidiaryId":"101101160630000005"},{"stepContact":"张经兰","stepId":"3880","stepName":"国税报道","stepStatus":"待处理","outWorkerId":"1337","subsidiaryId":"101101160630000005"},{"stepContact":"张经兰","stepId":"3881","stepName":"地税报道","stepStatus":"待处理","outWorkerId":"1337","subsidiaryId":"101101160630000005"}]}}'));


it('outSideTaskPageTest', async () => {
    const response = await fetch('https://app.i-counting.cn/app/v0/outsource/task');
    const result = await response.json();
    expect(result.success).toEqual(true);
});


it('outSideTaskPageTest Component should be render', () => {
    //.find(selector) 是 Enzyme shallow Rendering 提供的语法, 用于查找节点
    // 详细用法见 Enzyme 文档 http://airbnb.io/enzyme/docs/api/shallow.html
    let companyInfoView = wrapper.find('companyInfoView');
    // console.log(timerBtn.instance());
    expect(wrapper.find('companyInfoView').exists());
});


it('outSideTaskPageTest Component should be render', () => {
    //.find(selector) 是 Enzyme shallow Rendering 提供的语法, 用于查找节点
    // 详细用法见 Enzyme 文档 http://airbnb.io/enzyme/docs/api/shallow.html
    let companyInfoView = wrapper.find('companyInfoView');
    // console.log(timerBtn.instance());
    expect(wrapper.find('companyInfoView').exists());
});

function timerGame(callback) {
    console.log('Ready....go!');
    setTimeout(() => {
        console.log('Times up -- stop!');
        callback && callback();
    }, 1000);

    setTimeout(() => {
        console.log('Times up -- stop!');
    }, 2000);
}

test('waits 1 second before ending the game', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    timerGame(callback);

    expect(setTimeout.mock.calls.length).toBe(2);
    console.log(setTimeout.mock);
    expect(setTimeout.mock.calls[1][1]).toBe(2000);
    jest.runAllTimers();
    // Now our callback should have been called!
    expect(callback).toBeCalled();
    expect(callback.mock.calls.length).toBe(1);
});

it('outSideTaskPageTest 重复跳转逻辑', () => {
    jest.useFakeTimers();
    let instance = wrapper.instance();
    instance.toLicense(null);
    // instance.toLicense(null);

    // expect(instance.state.canClickBtn, false);
    setTimeout(() => {
        instance.toLicense(null);
    }, 2000);

    jest.runAllTimers();
    expect(instance.state.canClickBtn, true);
});
