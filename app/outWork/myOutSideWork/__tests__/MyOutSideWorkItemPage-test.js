/**
 * by liufei on 2017-8-21
 */

import 'react-native';
import React from 'react';
import MyOutSideWorkItemPage from '../MyOutSideWorkItemPage'
import {shallow} from 'enzyme';
import fetchMock from 'fetch-mock';

const navigator = Object.create(null);

navigator.setOnNavigatorEvent = jest.fn();
navigator.setButtons = jest.fn();
navigator.callback = jest.fn();
navigator.push=jest.fn();

const wrapper = shallow(
    <MyOutSideWorkItemPage navigator={navigator}/>

);
let instance = wrapper.instance();

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

//提取方法以便复用
repeatClick=(time,state)=>{
    wrapper.setProps({allList:'all'});//设置属性值执行if语句

    jest.useFakeTimers();

    instance._press(null);
    setTimeout(() => {
        expect(instance.state.canClickBtn).toEqual(state);
    }, time);

    jest.runAllTimers(null);

}

it('MyOutSideWorkItemPage 1s内不可以点击', () => {
    repeatClick(500,false);
});

it('MyOutSideWorkItemPage 超过1s可点击', () => {
    repeatClick(2000,true);
});

it('接口请求后dataSource状态值设置', (done) => {
    fetchMock.post('*', {"success":true,"code":200,"data":[{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0},{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0}],"jest-post": true},);

    instance. _loadList();

    jest.useRealTimers();//使用真正的定时器用于同步接口请求

    setTimeout(function() {
        //获取datasource中的数据
        expect(instance.state.dataSource._dataBlob.s1).toEqual([{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0},{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0}]);
        done();
    }, 1000);

});

it('接口请求后loadingMore的值', (done) => {
    fetchMock.post('*', {"success":true,"code":200,"data":[{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0},{ "corpName": "北京XX公司", "stepId": "测试内容r311","stepName": "银行开户","taskId": "测试内容i2uk","taskName": "注册公司","taskStatus": 0}],"jest-post": true},);

    instance. _loadList();

    jest.useRealTimers();//使用真正的定时器用于同步接口请求

    setTimeout(function() {
        //获取datasource中的数据
        expect(instance.state.loadingMore).toEqual(2);  //因为mock的接口数据只有2条小于15
        done();
    }, 1000);

});