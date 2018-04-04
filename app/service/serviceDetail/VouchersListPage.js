/**
 * Created by jiaxueting on 2018/4/3.
 * 我的凭证列表页
 */
import React  from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    FlatList,
    InteractionManager
} from 'react-native';
import { Pie } from 'react-native-pathjs-charts'
import BComponent from '../../base';
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis/service';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';

import demoData from './local/TaxFormPage.json'

import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import VouchersCell from "../view/VouchersCell";

export default class VouchersListPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            total:'- -',//本月累计
            data:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex
        }

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    componentWillUnmount() {
        UMTool.onEvent('t_return')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }
    loadData(date='',isPull=false){

        if (this.props.is_demo == '1'){
            this.setState({
                data:demoData.list,
            })
            return;
        }

        if(isPull){
            this.setState({
                isRefreshing:true
            })
        }else{
            this.setState({
                isLoading:true
            })
        }
        apis.loadVouchers(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){
                    console.log("凭证数据="+responseData.data);
                    this.setState({
                        data:responseData.data?responseData.data:[],
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false
                    })
                }else{
                    this.setState({
                        isRefreshing:false,
                        isLoading:false

                    })
                    Toast.show(responseData.msg?responseData.msg:'加载失败！')
                }
            },
            (e) => {
                this.setState({
                    isRefreshing:false,
                    isLoading:false
                })
                Toast.show('加载失败！')
            },
        );
    }
    _onRefresh(){
        this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate,true)
    }
    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }
    _listHeaderComponent(){
        return (
            <Image style={{width:DeviceInfo.width,justifyContent:'center',alignItems:'center',marginBottom:setSpText(11)}}
                   source={require('../../img/service_receive_bg.png')}>

            <View style={{width:DeviceInfo.width,justifyContent:'center',alignItems:'center',}}>
                <Text style={{fontSize:20,color:'#FFFFFF'}}>
                    泰安市中达文化传媒有限公司
                </Text>

            </View>
            </Image>
        )
    }

    _renderItem(item){
        return(
            <VouchersCell
                onPress = {this._goVoucherDetail.bind(this,item)}
                item = {item.item}
            />

        )
    }

    //跳转记账凭证详情
    _goVoucherDetail(item){
        console.log("------id="+item._id);
        this.push({
            screen: 'AccountVoucherPage',
            title:'记账凭证',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                timeDateArr:this.state.timeDateArr,
                timeIndex:this.state.timeIndex,
                companyid:this.props.companyid,
                id:item._id,
            }
        })
    }

    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.42+20
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据</Text>
                    {/*<Text style={{fontSize:15,color:'#999999',marginTop:10}}>或者致电客服热线:400-107-0110</Text>*/}
                </View>
            )
        }else{
            return <View />
        }
    }
    render(){

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="我的凭证" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <FlatList
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    data={this.state.data}
                    keyExtractor = {(item, index) => index}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                <PLPActivityIndicator isShow={this.state.isLoading} />
                {/*<ChooseTimerModal ref="ChooseTimerModal" disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>*/}
            </View>
        )
    }
    _callback(index){
        this.setState({
            timeIndex:index
        })
        // alert(this.state.timeDateArr[index].relateDate)
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }

}