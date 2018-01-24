/**
 * Created by zhuangzihao on 2017/9/25.
 */
import React,{Component}  from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    InteractionManager
} from 'react-native';
import SectionHeader from '../../view/SectionHeader'
import BComponent from '../../base';
import HeaderView from '../view/HeaderView'
import ChooseTimerModal from '../../view/ChooseTimerModal'
import * as apis from '../../apis';
import Toast from 'react-native-root-toast'
import PLPActivityIndicator from '../../view/PLPActivityIndicator';
import ServiceNavigatorBar from '../view/ServiceNavigatorBar'
import TimeSearchBarTest from '../view/TimeSearchBarTest'

import demoData from './local/ProfitStatementPage.json'
export default class ProfitStatementPage extends BComponent {
    constructor(props) {
        super(props);
        this.state = {
            profit:'- -',
            income:'- -',
            expenditure:'- -',
            dataSource:[],
            isRefreshing:false,
            isfirstRefresh:true,
            isLoading:false,

            timeDateArr:props.timeDateArr,
            timeIndex:props.timeIndex,



        };
    }
    static navigatorStyle = {
        navBarHidden: true, // 隐藏默认的顶部导航栏
        tabBarHidden: true, // 默认隐藏底部标签栏
    };
    componentWillUnmount() {
        UMTool.onEvent('p_return')
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(this.state.timeDateArr[this.state.timeIndex].relateDate)
        });
    }

    loadData(date='',isPull=false){

        if(this.props.is_demo=='1'){

            let today = new Date()
            let arr = [];

            for (let i = today.getMonth();i>=0;i--){
                let dic = demoData.list[11-i];
                arr.push(dic);
            }
            this.setState({
                profit:arr[0].profit,
                income:arr[0].income,
                expenditure:arr[0].expenditure,
                dataSource:arr,
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

        apis.loadProfit(this.props.companyid,date).then(
            (responseData) => {
                if(responseData.code == 0){

                    this.setState({
                        profit:responseData.profit?responseData.profit:'- -',
                        income:responseData.income?responseData.income:'- -',
                        expenditure:responseData.expenditure?responseData.expenditure:'- -',
                        dataSource:responseData.list?responseData.list:[],
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

    _renderItem(item){
        return(
            <Cell item={item}/>
        )
    }

    _listHeaderComponent(){
        return(
            <View style={{width:DeviceInfo.width}}>
                <HeaderView
                    hasTop={true}
                    topDes="本月利润"
                    topNum={this.state.profit}
                    leftDes="收入"
                    leftNum={this.state.income}
                    rightDes="支出"
                    rightNum={this.state.expenditure}


                />
                <SectionHeader style={{backgroundColor:'#F1F1F1'}} leftViewStyle={{backgroundColor:'#C6A567'}} text="利润表明细"/>
            </View>
        )
    }
    _showTimer(){
        this.refs.ChooseTimerModal._showTimer()
    }
    _listEmptyComponent(){
        let headerHeight = 48+64+DeviceInfo.width*0.56
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
                <ServiceNavigatorBar isSecondLevel = {true} isDemo = {this.props.is_demo} navigator={this.props.navigator} title="利润表" year={this.state.year} month={this.state.month} callback = {this._callback.bind(this)}/>
                <TimeSearchBarTest
                    timeDateArr = {this.state.timeDateArr}
                    timeIndex = {this.state.timeIndex}
                    callback = {this._callback.bind(this)}
                />
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor = {(item, index) => index}
                    renderItem={this._renderItem.bind(this)}
                    ListHeaderComponent={this._listHeaderComponent.bind(this)}
                    onRefresh={this._onRefresh.bind(this)}
                    refreshing={this.state.isRefreshing}
                    ListEmptyComponent={this._listEmptyComponent.bind(this)}
                />
                {/*<ChooseTimerModal ref="ChooseTimerModal" disabled={this.props.is_demo == '1'?true:false} yearSelected={this.props.year} monthSelected={this.props.month} callback ={this._callback.bind(this)}/>*/}
                <PLPActivityIndicator isShow={this.state.isLoading} />

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

class Cell extends Component{

    render(){
        return(
            <View style={[{width:DeviceInfo.width,height:85,backgroundColor:'white',paddingLeft:13,flexDirection:'row',alignItems:'center'},this.props.item.index==0?{marginTop:0}:{marginTop:10}]}>
                <View style={[{width:30,height:85,justifyContent:'center',alignItems:'center'},this.props.item.index%2==0?{backgroundColor:'#C6A567'}:{backgroundColor:'#EB5B47'}]}>
                    <Text style={{fontSize:setSpText(16),color:'white'}}>{this.props.item.item.date}</Text>
                    <Text style={{fontSize:setSpText(16),color:'white',marginTop:5}}>月</Text>
                </View>
                <View style={{flex:1,borderRightWidth:0.5,borderRightColor:'#dcdcdc',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:setSpText(14),color:'#999999'}}>利润</Text>
                    <Text style={{color:'#E13238',fontSize:setSpText(20),marginTop:10}}>{this.props.item.item.profit}</Text>
                </View>
                <View style={{flex:1,justifyContent:'space-between',paddingLeft:15}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>收入</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.income}</Text>
                    </View>
                    <View style={{flexDirection:'row' ,alignItems:'center',marginTop:10}}>
                        <Text style={{fontSize:setSpText(14),color:'#999999'}}>支出</Text>
                        <Text style={{fontSize:setSpText(16),color:'#333333',marginLeft:9}}>{this.props.item.item.expenditure}</Text>
                    </View>
                </View>
            </View>
        )
    }
}