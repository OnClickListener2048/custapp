/**
 * Created by zhuangzihao on 2017/8/22.
 */
import 'react-native';
import React from 'react';
import fetchMock from 'fetch-mock';
import {shallow} from 'enzyme';
import ApplicationCenterPage from '../ApplicationCenterPage';
import responseData from './responseData.json'
import renderer from 'react-test-renderer';

const navigator = Object.create(null);
navigator.setOnNavigatorEvent = jest.fn();
const wrapper = shallow(
    <ApplicationCenterPage navigator={navigator}/>
);
let instance = wrapper.instance();
fetchMock.post('*', responseData);
test('test _loadCount 测试消息数是否正确渲染', (done) => {
    instance.componentWillMount()
    jest.useRealTimers();
    setTimeout(function() {
        expect(instance.state.bdNum).toEqual(responseData.data.todoNum+responseData.data.inProgressNum);
        done();
    }, 1000);

})

test('快照正确渲染', () => {
    const tree = renderer.create(
        <ApplicationCenterPage  navigator={navigator}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
    // 只能操作属性
    expect(tree).toMatchSnapshot();
});

test('test toMyOutSideWork 外勤按钮重复点击', () => {
    instance.toMyOutSideWork()
    expect(instance.state.canClickBtn).toEqual(false);
});