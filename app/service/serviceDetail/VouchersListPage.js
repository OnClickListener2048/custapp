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
import BComponent from '../../base';
import * as apis from '../../apis/service';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import demoData from './local/VouchersListPage.json'

import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'
import VouchersCell from "../view/VouchersCell";
import {exportFile} from '../../util/XlsxTool';
import {formatmoney} from '../../util/FormatMoney';

export default class VouchersListPage extends BComponent {

    constructor(props){
        super(props)
        this.state={
            data:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,
            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,
            xslxData:[],//表格数据
        }

    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    // componentWillUnmount() {
    //     UMTool.onEvent('t_return')
    // }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }
    loadData(date='',isPull=false){
        if (this.props.is_demo == '1'){
            this.setState({
                data:demoData.data,
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
                    let xslxData = [['日期','凭证字号','摘要','会计科目','借方金额','贷方金额']]

                    console.log("凭证数据="+responseData.data);

                    for(let i = 0 ;i<responseData.data.length; i++){
                        let dic = responseData.data[i];
                        for(let j = 0 ;j<dic.subjectDetails.length; j++){
                            let detail = dic.subjectDetails[j];
                            xslxData.push([dic.relateDate.substring(0,10),dic.voucherWord,detail.subject_Abstract,detail.subjectName,formatmoney(detail.debitMoney),formatmoney(detail.creditorMoney)])
                            console.log('==[]=='+xslxData[i+1]);
                        }

                    }

                    this.setState({
                        data:responseData.data?responseData.data:[],
                        isRefreshing:false,
                        isfirstRefresh:false,
                        isLoading:false,
                        xslxData:xslxData,
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

            <View style={{width:DeviceInfo.width,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                <Text style={{fontSize:20,color:'#FFFFFF'}}>
                    {this.props.companyName?this.props.companyName:'噼里啪财税演示公司'}
                </Text>

            </View>
            </Image>
        )
    }

    _shareToWeXin(){
        exportFile(this.state.xslxData,'我的凭证',[{wpx: DeviceInfo.width/7}, {wpx: DeviceInfo.width/7}, {wpx: DeviceInfo.width/7*2.5},{wpx: DeviceInfo.width/7*2.5}, {wpx: DeviceInfo.width/7}, {wpx: DeviceInfo.width/7}])

    }

    _renderItem(item){
        return(
            <VouchersCell
                onPress = {this._goVoucherDetail.bind(this,item)}
                item = {item.item}
                isclick = {true}
            />

        )
    }

    //跳转记账凭证详情
    _goVoucherDetail(item){
        if (this.props.is_demo == '1'){
            Toast.show('演示数据暂不支持查看凭证详情！')
            return;
        }
        this.push({
            screen: 'AccountVoucherPage',
            title:'记账凭证',
            backButtonHidden: true, // 是否隐藏返回按钮 (可选)
            passProps:{
                companyName:this.props.companyName,
                relatedate:item.item.relateDate.substring(0,10),
                companyid:this.props.companyid,
                id:item.item.voucherId,
                dataDetail:item.item
            }
        })
    }

    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.42+20
        if(!this.state.isfirstRefresh){
            return(
                <View style={{width:DeviceInfo.width,alignItems:'center',height:DeviceInfo.height-headerHeight,justifyContent:'center'}}>
                    <Text style={{fontSize:15,color:'#999999'}}>暂时没有查到相关数据</Text>
                </View>
            )
        }else{
            return <View />
        }
    }
    render(){

        return(
            <View style={{flex:1,backgroundColor:'#F1F1F1'}}>
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="我的凭证"
                                     shareToWeXin = {this._shareToWeXin.bind(this)}/>
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
            </View>
        )
    }
    _callback(index){
        this.setState({
            timeIndex:index
        })
        this.loadData(this.state.timeDateArr[index].relateDate)
        this.props.callback && this.props.callback(index)
    }

}