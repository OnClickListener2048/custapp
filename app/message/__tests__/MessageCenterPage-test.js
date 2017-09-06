/**
 * Created by zhuangzihao on 2017/8/22.
 */
import 'react-native';
import React from 'react';
import fetchMock from 'fetch-mock';
import {shallow} from 'enzyme';
import MessageCenterPage from '../MessageCenterPage';
import responseData from './loadData.json'
const navigator = Object.create(null);
navigator.setOnNavigatorEvent = jest.fn();
navigator.setButtons = jest.fn();
navigator.setTabBadge = jest.fn();
navigator.push = jest.fn();
const wrapper = shallow(
    <MessageCenterPage navigator={navigator}/>
);
let instance = wrapper.instance();
test('test _loadInitData 第一次进入数据初始化', (done) => {
    fetchMock.post('*', responseData);
    instance._loadInitData()
    //模拟异步请求数据
    jest.useRealTimers();
    setTimeout(function() {
        //mock数据的消息数
        let cnt = responseData.unReadNum;
        //消息数比较
        expect(instance.state.bagetNum).toEqual(cnt);
        let data = responseData.data
        for (let  i = 0 ; i < data.length ; i++){
            let  secData = data[i];
            secData.rowIndex = i;
        }
        //数据源比较
        expect(instance.state.dataSource._dataBlob.s1).toEqual(data);
        //下拉刷新状态比较
        expect(instance.state.isRefreshing).toEqual(false);
        //请求状态比较
        expect(instance.state.loaded).toEqual(true);
        //是否请求失败比较
        expect(instance.state.faild).toEqual(false);
        if (data.length == instance.state.pageCount){
            //正好请求pageCount条时，最后一个数据的ID比较
            expect(instance.state.lastID).toEqual(data[data.length-1].msgId);
        }else {
            //尾部loadingMore状态的比较
            expect(instance.state.loadingMore).toEqual(2);
        }
        done();
    }, 1000);
})

test('test _loadData下拉刷新 ', (done) => {
    fetchMock.post('*', responseData);
    instance._loadData()
    //模拟异步请求数据
    jest.useRealTimers();
    setTimeout(function() {
        //mock数据的消息数
        let cnt = responseData.unReadNum;
        //消息数比较
        expect(instance.state.bagetNum).toEqual(cnt);
        let data = responseData.data
        for (let  i = 0 ; i < data.length ; i++){
            let  secData = data[i];
            secData.rowIndex = i;
        }
        //数据源比较
        expect(instance.state.dataSource._dataBlob.s1).toEqual(data);
        //下拉刷新状态比较
        expect(instance.state.isRefreshing).toEqual(false);
        //请求状态比较
        expect(instance.state.loaded).toEqual(true);
        //是否请求失败比较
        expect(instance.state.faild).toEqual(false);
        if (data.length == instance.state.pageCount){
            //正好请求pageCount条时，最后一个数据的ID比较
            expect(instance.state.lastID).toEqual(data[data.length-1].msgId);
        }else {
            //尾部loadingMore状态的比较
            expect(instance.state.loadingMore).toEqual(2);
        }
        done();
    }, 1000);
})
//mock 数据必须在15条时才可以进行测试  因为如果不足15条（pageCount）不会进行上滑加载更多 导致数据源和预期数据不一样
test('test _loadMoreData 加载更多', (done) => {
    fetchMock.post('*', responseData);
    //首先加载第一页数据
    instance._loadData()
    //模拟异步请求数据
    jest.useRealTimers();
    setTimeout(function() {
        //进行上滑加载更多
        instance._loadMoreData()
        //模拟异步请求数据
        jest.useRealTimers();
        setTimeout(function() {
            let cnt = responseData.unReadNum;
            //消息数比较
            expect(instance.state.bagetNum).toEqual(cnt);
            let data = responseData.data
            //深拷贝出一个对象 不然后面的循环会出问题
            let data1 = JSON.parse(JSON.stringify(data));
            let data2 = data.concat(data1)
            for (let i = 0 ;i<data2.length;i++){
                data2[i].rowIndex = i;
            }
            //比较数据源和期望的列表数据是否相同
            expect(instance.state.dataSource._dataBlob.s1).toEqual(data2);
            // console.log('instance.state.dataSource._dataBlob.s1',instance.state.dataSource._dataBlob.s1)
            // console.log('data2',data2)
            //下拉刷新状态比较
            expect(instance.state.isLoading).toEqual(false);
            //请求状态比较
            expect(instance.state.loaded).toEqual(true);
            //是否请求失败比较
            expect(instance.state.faild).toEqual(false);
            //footer 状态
            if (data1.length == instance.state.pageCount){
                expect(instance.state.loadingMore).toEqual(0);
                expect(instance.state.lastID).toEqual(data2[data2.length - 1].msgId);
            }else {
                expect(instance.state.loadingMore).toEqual(2);
            }
            done();
        }, 1000);
    }, 1000);
})

//time 定时器时间  state 是否可点击变量期望的值 funName防重复点击的方法名 stateName是否可点击变量期望的名称
repeatClick=(time,state,funName,stateName)=>{

    jest.useFakeTimers();

    instance[funName]();
    setTimeout(() => {
        expect(instance.state[stateName]).toEqual(state);
    }, time);
    jest.runAllTimers(null);

}
//mock toMyOutSideWork  只含有防重复点击的逻辑
instance.toMyOutSideWork = instance.toSystemMessagePage = (()=>{
    if (instance.state.isJumping === true){
        return;
    }
    instance.setState({isJumping:true})//防重复点击

    instance.timer = setTimeout(async()=>{
        await instance.setState({isJumping:false})//1.5秒后可点击
    },1000)
});
test('test toMyOutSideWork 防止重复点击 isJumping 0.5秒时状态', () => {
    repeatClick(500,true,'toMyOutSideWork','isJumping')
})

test('test toMyOutSideWork 防止重复点击 2.5秒时状态', () => {
    repeatClick(2500,false,'toMyOutSideWork','isJumping')
})

test('test toSystemMessagePage 防止重复点击 isJumping 0.5秒时状态', () => {
    repeatClick(500,true,'toSystemMessagePage','isJumping')
})

test('test toSystemMessagePage 防止重复点击 2.5秒时状态', () => {
    repeatClick(2500,false,'toSystemMessagePage','isJumping')
})

test('test _readed 测试已读逻辑', (done) => {
    
})
